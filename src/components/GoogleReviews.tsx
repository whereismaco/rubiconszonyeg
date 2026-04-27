import ReviewsCarousel from "./ReviewsCarousel";
import { getReviews } from "@/lib/actions";

export default async function GoogleReviews({ title, subtitle }: { title?: string; subtitle?: string }) {
  const dbReviews = await getReviews();

  if (!dbReviews || dbReviews.length === 0) {
    return null;
  }

  // Átkonvertáljuk az adatbázis sorait a Carousel által várt formátumra
  const reviews = dbReviews.map((r: any) => ({
    name: r.id.toString(),
    rating: r.rating,
    text: { text: r.text, languageCode: "hu" },
    authorAttribution: {
      displayName: r.reviewer_name,
      photoUri: "", // Nincs profilkép jelenleg
    },
    relativePublishTimeDescription: "",
  }));

  // Csak az 5 csillagos (vagy a kiemelt) értékeléseket mutatjuk meg? 
  // Jelenleg az 5 csillagosokat szűrjük a kérés szerint, ahogy korábban.
  const fiveStarReviews = reviews.filter((r: any) => r.rating === 5);

  if (fiveStarReviews.length === 0) {
    return null;
  }

  // Statisztika számítása (Google Maps szerinti fix értékek)
  const userRatingCount = reviews.length; // vagy 79, ha a pontos értékelésszámot is be akarod égetni
  const roundedRating = 4.7;

  const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/SpRePRjg2beahjgC8";

  return (
    <ReviewsCarousel 
      reviews={fiveStarReviews}
      rating={roundedRating}
      userRatingCount={userRatingCount}
      googleMapsLink={GOOGLE_MAPS_LINK}
      title={title}
      subtitle={subtitle}
    />
  );
}

