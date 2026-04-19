"use client";

import { useRef, useState, useEffect } from "react";
import { Star, Quote, ExternalLink, PenLine, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
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

interface ReviewsCarouselProps {
  reviews: Review[];
  rating: number;
  userRatingCount: number;
  googleMapsLink: string;
  title?: string;
  subtitle?: string;
}

export default function ReviewsCarousel({ reviews, rating, userRatingCount, googleMapsLink, title, subtitle }: ReviewsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Görgetési állapot ellenőrzése a nyilak elrejtéséhez/megjelenítéséhez
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Kiszámoljuk egy kártya szélességét a gap-pel (24px) együtt
      const card = scrollContainerRef.current.firstElementChild as HTMLElement;
      if (card) {
        const scrollAmount = card.offsetWidth + 24; 
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Fejléc */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#1D63B7] font-bold text-sm tracking-widest uppercase mb-3">
            Ügyfeleink Mondták
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#181A2C] mb-6">
            {title || "Eredmények, amik magukért beszélnek"}
          </h2>
          <p className="text-xl text-gray-600 font-light mb-8 max-w-2xl">
            {subtitle || "Nem csupán ígérjük a minőséget – ügyfeleink visszajelzései a garanciánk a kiváló munkára."}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex text-[#FEC500]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="font-bold text-[#181A2C]">{rating}</span>
              <span className="text-gray-500 font-medium">Google értékeléseink alapján</span>
            </div>
          </div>
        </div>

        {/* Körhinta (Carousel) Konténer */}
        <div className="relative group">
          
          {/* Bal nyíl */}
          <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute -left-5 md:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white text-[#1D63B7] w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-all focus:outline-none ${!canScrollLeft ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-[#1D63B7] hover:text-white hover:scale-110'}`}
            aria-label="Előző értékelések"
          >
            <ChevronLeft size={32} strokeWidth={2} />
          </button>

          {/* Értékelések */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth pb-8 pt-4 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review) => {
              const reviewText = review.originalText?.text || review.text?.text || "";
              const timeAgo = review.relativePublishTimeDescription
                .replace(' months ago', ' hónapja')
                .replace('a month ago', '1 hónapja')
                .replace('a year ago', '1 éve')
                .replace(' years ago', ' éve')
                .replace(' weeks ago', ' hete')
                .replace('a week ago', '1 hete')
                .replace(' days ago', ' napja')
                .replace('a day ago', '1 napja');
              
              return (
                <div 
                  key={review.name} 
                  /* A szélesség pontos beállítása: mobilon 100%, tableten 50%, gépen 33.33% (a gap (24px) figyelembevételével) */
                  className="shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow snap-start flex flex-col relative"
                >
                  {/* Elegáns, halvány idézőjel */}
                  <div className="absolute top-6 right-6 text-gray-100">
                    <Quote size={60} className="rotate-12" strokeWidth={1} />
                  </div>

                  {/* Csillagok */}
                  <div className="flex text-[#FEC500] mb-5 relative z-10">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Szöveg */}
                  <p className="text-gray-600 leading-relaxed flex-grow italic mb-8 relative z-10 font-light">
                    &quot;{reviewText}&quot;
                  </p>

                  {/* Szerző és időpont */}
                  <div className="mt-auto relative z-10 flex items-center justify-between border-t border-gray-50 pt-5">
                    <h3 className="font-bold text-[#181A2C]">
                      {review.authorAttribution.displayName}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {timeAgo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jobb nyíl */}
          <button 
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute -right-5 md:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white text-[#1D63B7] w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-all focus:outline-none ${!canScrollRight ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-[#1D63B7] hover:text-white hover:scale-110'}`}
            aria-label="Következő értékelések"
          >
            <ChevronRight size={32} strokeWidth={2} />
          </button>

        </div>

        {/* Akció Gombok (Linkek) */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={googleMapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#181A2C] hover:bg-[#1D63B7] text-white w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-colors"
          >
            <ExternalLink size={20} />
            Összes értékelés megtekintése
          </a>
          <a 
            href={googleMapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-[#181A2C] border border-gray-200 hover:border-[#181A2C] hover:bg-gray-50 w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-colors shadow-sm"
          >
            <PenLine size={20} />
            Értékelés írása
          </a>
        </div>

      </div>
    </section>
  );
}
