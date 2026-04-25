# Rubicon Szőnyegtisztítás - Projekt Dokumentáció (GEMINI.md)

Ez a fájl tartalmazza a Rubicon weboldal és adminisztrációs portál teljes technikai és üzleti logikáját, hogy a jövőbeli fejlesztések során azonnal kontextusba kerülhess.

## 🚀 Technológiai Stack
- **Keretrendszer:** Next.js 16.2.3 (Turbopack)
- **Frontend:** React 19, Tailwind CSS 4 (vanilla CSS mentes, utility-first)
- **Adatbázis:** SQLite (`rubicon.db`), Kezelő: `better-sqlite3`
- **Hitelesítés:** NextAuth.js (Google Provider) + Whitelist alapú beléptetés
- **Email:** Nodemailer (SMTP - Hostinger)
- **Ikonok:** Lucide React

---

## 🏗️ Adatbázis Szerkezet (`src/lib/db.ts`)

### `jobs` tábla (Munkák / Ajánlatkérések)
- `id`: Elsődleges kulcs
- `name`: Ügyfél neve
- `phone`: Ügyfél telefonszáma
- `email`: Ügyfél email címe (Reply-To-ként is használva)
- `address`: Ügyfél címe
- `map_link`: Automatikusan generált Google Maps keresési link
- `status`: 'Ajánlatra vár', 'Felvételre vár', 'Beérkezett', 'Tisztítás alatt', 'Elkészült', 'Kiszállítva'
- `total`: Bruttó végösszeg (Ft)
- `notes`: Ügyfél üzenete vagy belső megjegyzés
- `data_json`: A rendelés tételeinek (szőnyegek, autók, kárpitok) strukturált JSON listája.

### `settings` tábla (Kulcs-Érték párok)
Itt tárolódik minden, ami az Admin Portál "Beállítások" menüjében módosítható:
- Cégadatok (név, cím, telefon, logo)
- Weboldal szövegei (Hero, Referenciák, Kapcsolat szekciók)
- Kiszállítási díjak (`delivery_fee_base`, `delivery_fee_limit`)
- **`pricing_rug`**, **`pricing_upholstery`**, **`pricing_car`**: JSON formátumú árlisták.
- `whitelisted_emails`: Azok az email címek, amikkel be lehet lépni az admin felületre.

---

## 💰 Üzleti és Árazási Logika

### 1. Szőnyegtisztítás Árazás
**Képlet:** `(Alapár + Anyag felár + Állapot felár + Extrák összege) * Terület`
- **Méret:** Centiméterben (cm) kérjük be, de négyzetméterben (m²) számolunk.
- **Minimum méret:** Ha a számolt terület > 0, de < 1 m², akkor **1 m²-re kerekítjük**.
- **Dinamizmus:** Minden kategória (Vastagság, Anyag, Szennyeződés) az adatbázisból töltődik be. Ha egy új tételt adunk hozzá, automatikusan a beállítások szerinti legelső opciót kapja meg (elkerülve a 0 Ft-os hibát).

### 2. Kárpittisztítás Árazás
**Képlet:** `(Típus alapára + Extrák összege) * Mennyiség`
- Az ajánlatkérőn megadható darabszám.
- **Tételkezelés:** Ha az ügyfél pl. 3 db fotelt kér, a rendszer **3 különálló tételként** menti el, hogy az admin egyenként kezelhesse/módosíthassa őket.

### 3. Autókozmetika Árazás
**Képlet:** `Csomag alapár + Kategória felár (Méret) + Extrák összege`

### 4. Kiszállítási Díj
- Ha a rendelés `subtotal` összege < `delivery_fee_limit`, akkor hozzáadódik a `delivery_fee_base`.
- Ha eléri vagy meghaladja a limitet, a kiszállítás **ingyenes**.

---

## 🖥️ Főbb Komponensek

### `QuoteForm.tsx` (Főoldali Ajánlatkérő)
- Két mód: **Egyszerű** (csak szöveges üzenet) és **Haladó** (interaktív kalkulátor).
- Dinamikusan számolja a végösszeget és a kiszállítási díjat a `useMemo` hook segítségével.
- `quote-summary-container`: Külön konténerbe zárt végösszeg kijelzés, ami igény szerint elrejthető.

### `CalculatorUI.tsx` (Admin Munkafelvétel)
- Ugyanazt a számítási logikát használja, mint a főoldal.
- Itt szerkeszthetők az ügyféladatok, tételek és a belső gyorsjegyzetek.
- **Útvonaltervezés:** A cím mellett gomb nyitja meg a Google Maps-et.

### `PricingTable.tsx` (Publikus Árlista)
- Három fül (Szőnyeg, Kárpit, Autó).
- Balra igazított kategóriák, jobbra igazított árak.
- Kárpittisztításnál listás elrendezés (hasonlóan a szőnyeghez).

### `BeforeAfterGallery.tsx`
- Függőleges csúszkás (slider) összehasonlító 1:1 (négyzet) arányban.
- Kattintható bélyegképek (thumbnails) az alján a váltáshoz.

### `MobileMenu.tsx`
- Jobbról becsúszó, fix (white) hátterű hamburger menü.
- `proxy.ts` (korábban middleware.ts) védi az admin útvonalakat.

---

## 📧 Értesítési Rendszer
Új ajánlatkéréskor a rendszer emailt küld az `info@rubiconszonyeg.hu` címre.
- **Transzport:** Hostinger SMTP (`smtp.hostinger.com:465`).
- **Biztonság:** A jelszót és kulcsokat a `.env.local` fájlból olvassa (`SMTP_PASS`, stb.).
- **Válaszcím:** Az értesítő email `replyTo` mezője az ügyfél email címe, így egyből lehet neki válaszolni.

---

## 🛠️ Adminisztráció és Karbantartás
- **Belépés:** Csak a `whitelisted_emails` listában szereplő címekkel, Google loginon keresztül.
- **Beállítások:** Mentés után `redirect` és `?success=1` paraméterrel jelezzük a sikert a fejlécben.
- **Deploy:** Fontos, hogy a `nodemailer` és `better-sqlite3` csomagok a `dependencies` között legyenek a buildhez.
