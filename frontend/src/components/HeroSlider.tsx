"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Header from "./Header";

const slides = [
  {
    image: "/hero/lodges.jpg",
    label: "Lodges",
    heading: "Find your next lodge in Nsukka",
    href: "/lodges",
    cta: "Browse Lodges",
  },
  {
    image: "/hero/marketplace.png",
    label: "Marketplace",
    heading: "Buy and sell without the wahala",
    href: "/marketplace",
    cta: "Browse Marketplace",
  },
  {
    image: "/hero/roommate.jpg",
    label: "Roommates",
    heading: "Find a roommate who fits your vibe",
    href: "/roommates",
    cta: "Find a Roommate",
  },
];

export default function HeroSlider() {

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-[580px] md:h-[600px] overflow-hidden">
      <Header overlay />

      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.label} className="relative flex-[0_0_100%] h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

              <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-between py-10">
                <div>
                  <span className="text-6xl md:text-8xl font-extrabold tracking-tight text-white">
                    KAM<span className="text-kampurse-green">PURSE</span>
                  </span>
                </div>

                <div className="max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <p className="text-kampurse-green font-medium text-sm uppercase tracking-wide mb-2">
                    {slide.label}
                  </p>
                  <h2 className="text-white text-2xl md:text-3xl font-semibold mb-5">
                    {slide.heading}
                  </h2>
                  <Link
                    href={slide.href}
                    className="inline-block bg-kampurse-green text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-kampurse-green-dark transition-colors"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Show ${slide.label} slide`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === selected ? "bg-kampurse-green" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}