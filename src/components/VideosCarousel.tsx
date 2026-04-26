"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BeforeAfterGallery from "./BeforeAfterGallery";

interface VideosCarouselProps {
  title: string;
  subtitle: string;
  v1Title: string;
  v1Desc: string;
  v1Iframe: string;
  v2Title: string;
  v2Desc: string;
  v2Iframe: string;
  v3Title: string;
  v3Desc: string;
  v3Iframe: string;
}

export default function VideosCarousel({
  title,
  subtitle,
  v1Title,
  v1Desc,
  v1Iframe,
  v2Title,
  v2Desc,
  v2Iframe,
  v3Title,
  v3Desc,
  v3Iframe,
}: VideosCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Get the width of one card + gap. Since gap is 6 (24px) or 10 (40px)
      // Let's just use the first child's offsetWidth
      const card = container.firstElementChild as HTMLElement;
      if (card) {
        const gap = window.innerWidth >= 768 ? 40 : 24; // md:gap-10 = 40px, gap-6 = 24px
        const scrollAmount = card.offsetWidth + gap;

        if (direction === "left") {
          if (scrollLeft <= 5) {
            container.scrollTo({ left: scrollWidth - clientWidth, behavior: "smooth" });
          } else {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          }
        } else {
          if (scrollLeft >= scrollWidth - clientWidth - 5) {
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }
    }
  };

  return (
    <section id="referenciak" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h3 className="text-4xl md:text-5xl font-bold text-[#064E3B] mb-6">{title}</h3>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div>
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 md:gap-10 snap-x snap-mandatory pb-4 pt-4 px-2 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          >
            <div className="shrink-0 w-[85vw] md:w-auto snap-center bg-gray-50 rounded-3xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-6 text-center flex-1">
                <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{v1Title}</h4>
                <p className="text-gray-600 leading-relaxed font-light">{v1Desc}</p>
              </div>
              <div className="w-full bg-white flex justify-center px-4 pb-4 [&>iframe]:w-full [&>iframe]:max-w-full [&>iframe]:aspect-[9/16] [&>iframe]:!h-auto [&>iframe]:rounded-2xl" dangerouslySetInnerHTML={{ __html: v1Iframe }}></div>
            </div>

            <div className="shrink-0 w-[85vw] md:w-auto snap-center bg-gray-50 rounded-3xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-6 text-center flex-1">
                <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{v2Title}</h4>
                <p className="text-gray-600 leading-relaxed font-light">{v2Desc}</p>
              </div>
              <div className="w-full bg-white flex justify-center px-4 pb-4 [&>iframe]:w-full [&>iframe]:max-w-full [&>iframe]:aspect-[9/16] [&>iframe]:!h-auto [&>iframe]:rounded-2xl" dangerouslySetInnerHTML={{ __html: v2Iframe }}></div>
            </div>

            <div className="shrink-0 w-[85vw] md:w-auto snap-center bg-gray-50 rounded-3xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-6 text-center flex-1">
                <h4 className="text-2xl font-bold text-[#181A2C] mb-4">{v3Title}</h4>
                <p className="text-gray-600 leading-relaxed font-light">{v3Desc}</p>
              </div>
              <div className="w-full bg-white flex justify-center px-4 pb-4 [&>iframe]:w-full [&>iframe]:max-w-full [&>iframe]:aspect-[9/16] [&>iframe]:!h-auto [&>iframe]:rounded-2xl" dangerouslySetInnerHTML={{ __html: v3Iframe }}></div>
            </div>
          </div>

          {/* Mobilos lapozógombok a videók alatt */}
          <div className="flex md:hidden justify-center gap-6 mt-8">
            <button
              onClick={() => scroll("left")}
              className="bg-[#064E3B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none hover:bg-[#059669] hover:scale-110 active:scale-95"
              aria-label="Előző videó"
            >
              <ChevronLeft className="w-8 h-8 pr-1" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-[#064E3B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none hover:bg-[#059669] hover:scale-110 active:scale-95"
              aria-label="Következő videó"
            >
              <ChevronRight className="w-8 h-8 pl-1" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Előtte-Utána Galéria */}
        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#181A2C] mb-4">Varázslatos Előtte-Utána Eredmények</h3>
            <p className="text-lg text-gray-600 font-light">Nézze meg a saját szemével, mire képes a Rubicon mélytisztítási technológiája!</p>
          </div>
          <BeforeAfterGallery />
        </div>

      </div>
    </section>
  );
}
