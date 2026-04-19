import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeGoogleReviews(placeId) {
  // Ebből a Place ID-ból készítünk egy Google Maps URL-t
  // Mivel nem tudjuk az eredeti linket, rákeresünk a Place ID-ra a térképen
  const url = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
  
  console.log(`Navigating to: ${url}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Beállítjuk a magyar nyelvet, hogy magyarul kapjuk az értékeléseket
  await page.setExtraHTTPHeaders({
      'Accept-Language': 'hu-HU,hu;q=0.9'
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // 1. lépés: "Összes elutasítása" gomb megnyomása a cookie panelen (ha van)
    try {
      const rejectButton = await page.$('button[aria-label="Összes elutasítása"]');
      if (rejectButton) {
        await rejectButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
        console.log("Cookie panel elutasítva.");
      }
    } catch (e) {
      console.log("Nem volt cookie panel vagy nem sikerült elutasítani.");
    }

    // 2. lépés: Megkeresni az "Értékelések" vagy "Vélemények" tab-ot (Gombot)
    // A Google Maps HTML-je folyamatosan változik, így aria-label vagy role alapján érdemes keresni
    await page.waitForSelector('button[role="tab"]', { timeout: 10000 });
    
    // Keresünk egy olyan gombot, aminek a szövegében benne van az "Értékelés" vagy "Vélemény"
    const tabs = await page.$$('button[role="tab"]');
    let reviewsTabFound = false;
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && (text.toLowerCase().includes('értékelés') || text.toLowerCase().includes('vélemény') || text.toLowerCase().includes('reviews'))) {
        await tab.click();
        reviewsTabFound = true;
        console.log("Vélemények fülre kattintva.");
        break;
      }
    }

    if (!reviewsTabFound) {
      throw new Error("Nem találtam meg a Vélemények fület.");
    }

    // Várjuk meg, amíg betöltődik az értékelések listája
    await page.waitForSelector('.jftiEf', { timeout: 10000 }); // Ez az osztálynév gyakran jelöli magát az értékelést

    console.log("Görgetés az értékelések betöltéséhez...");
    
    // 3. lépés: Görgetés (Scrape)
    // Meg kell találnunk azt a div-et, ami a scrollbar-t tartalmazza.
    // Ez trükkös, mert a Google sok div-et használ. Általában az egyik szülő div pörög.
    const scrollableDivSelector = '.m6QErb.DxyBCb.kA9KIf.dS8AEf'; // Ezt tesztelni kell, gyakran változik
    
    let previousHeight = 0;
    let currentHeight = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.scrollHeight : 0;
    }, scrollableDivSelector);

    // Próbáljunk meg mondjuk 10-szer görgetni (ez kb 50-100 értékelést jelenthet)
    for (let i = 0; i < 10; i++) {
        if (currentHeight === 0) break; // Ha nem találta meg a scrollable div-et, ne görgessen
        
        await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if(el) el.scrollTo(0, el.scrollHeight);
        }, scrollableDivSelector);
        
        // Várjunk picit, hogy a hálózat letöltse az új elemeket
        await new Promise(r => setTimeout(r, 2000));
        
        previousHeight = currentHeight;
        currentHeight = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          return el ? el.scrollHeight : 0;
        }, scrollableDivSelector);

        // Ha a magasság nem változott, elértük a végét
        if (currentHeight === previousHeight) break;
        
        // Extra: Ha van "Tovább" vagy "Bővebben" (More) gomb a hosszú szövegeknél, azt is meg kellene nyomni
        const moreButtons = await page.$$('button.w8nwRe.kyuRq');
        for (const btn of moreButtons) {
            await btn.click().catch(() => {});
        }
    }

    console.log("Értékelések kinyerése...");

    // 4. lépés: Adatok kinyerése az oldalból
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('.jftiEf'); // Az értékelés kártya fő class-a
      const extractedReviews = [];

      reviewElements.forEach((el) => {
        // Név
        const nameEl = el.querySelector('.d4r55');
        const name = nameEl ? nameEl.textContent.trim() : 'Ismeretlen';

        // Profilkép URL
        const imgEl = el.querySelector('img.N3Hzgf');
        const photoUri = imgEl ? imgEl.getAttribute('src') : '';

        // Időpont (pl. "2 hete")
        const timeEl = el.querySelector('.rsqaWe');
        const relativeTime = timeEl ? timeEl.textContent.trim() : '';

        // Csillagok (Az aria-label-ből szedjük ki, pl. "5 csillag")
        const starsEl = el.querySelector('.kvMYJc');
        let rating = 0;
        if (starsEl) {
           const label = starsEl.getAttribute('aria-label');
           if (label) {
               // Kiszedjük az első számot a szövegből
               const match = label.match(/(\d+)/);
               if(match) rating = parseInt(match[1], 10);
           }
        }

        // Értékelés szövege
        const textEl = el.querySelector('.wiI7pd');
        const text = textEl ? textEl.textContent.trim() : '';

        // Csak azokat mentjük, ahol van szöveg is (opcionális, de ajánlott)
        if (text) {
          extractedReviews.push({
            name: `scraped_${Date.now()}_${Math.random()}`,
            rating: rating,
            originalText: { text: text, languageCode: 'hu' },
            authorAttribution: {
              displayName: name,
              photoUri: photoUri
            },
            relativePublishTimeDescription: relativeTime
          });
        }
      });

      return extractedReviews;
    });

    console.log(`Sikeresen kinyerve: ${reviews.length} értékelés.`);

    // 5. lépés: Mentés JSON fájlba (a GooglePlaces formátumot imitálva)
    if (reviews.length > 0) {
        const placeDetails = {
            id: "scraped_data",
            rating: 4.7, // Ezt is lehetne scrapelni, most fix
            userRatingCount: reviews.length,
            displayName: { text: "Rubicon szőnyegtisztító" },
            reviews: reviews
        };
        
        fs.writeFileSync('data/scraped_reviews.json', JSON.stringify(placeDetails, null, 2));
        console.log('Mentve a data/scraped_reviews.json fájlba.');
    } else {
        console.log("Nem találtam értékeléseket (lehet, hogy változott a Google Maps HTML szerkezete).");
    }

  } catch (error) {
    console.error('Hiba a scraping során:', error);
  } finally {
    await browser.close();
  }
}

// Futtatás a Place ID-val
scrapeGoogleReviews('ChIJAXgrEnLhQUcR2p7b-NLc9ao');
