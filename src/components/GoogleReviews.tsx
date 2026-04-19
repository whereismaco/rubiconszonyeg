import fs from "fs";
import path from "path";
import ReviewsCarousel from "./ReviewsCarousel";

// Típusdefiníciók a Google Places API válaszához
interface GoogleReview {
  name: string;
  rating: number;
  text?: { text: string; languageCode: string };
  originalText?: { text: string; languageCode: string };
  authorAttribution: {
    displayName: string;
    photoUri: string;
  };
  relativePublishTimeDescription: string;
}

interface PlaceDetails {
  id: string;
  rating: number;
  userRatingCount: number;
  displayName: { text: string };
  reviews: GoogleReview[];
}

function getLocalReviews(): PlaceDetails | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reviews.json');
    if (!fs.existsSync(filePath)) {
      console.warn("Nem található a reviews.json fájl a data mappában.");
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as PlaceDetails;
  } catch (error) {
    console.error("Hiba a helyi értékelések beolvasásakor:", error);
    return null;
  }
}

export default function GoogleReviews({ title, subtitle }: { title?: string; subtitle?: string }) {
  const place = getLocalReviews();

  if (!place || !place?.reviews || place.reviews.length === 0) {
    return null;
  }

  // Csak az 5 csillagos értékeléseket mutatjuk meg
  const fiveStarReviews = place.reviews.filter(r => r.rating === 5);
  const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/SpRePRjg2beahjgC8";

  return (
    <ReviewsCarousel 
      reviews={fiveStarReviews}
      rating={place.rating}
      userRatingCount={place.userRatingCount}
      googleMapsLink={GOOGLE_MAPS_LINK}
      title={title}
      subtitle={subtitle}
    />
  );
}
