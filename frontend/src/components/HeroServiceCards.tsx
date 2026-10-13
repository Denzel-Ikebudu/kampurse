"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { HoverImage } from "@/components/PageMotion";

type Service = {
  number: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

type HeroServiceCardsProps = {
  services: Service[];
};

export default function HeroServiceCards({
  services,
}: HeroServiceCardsProps) {
  const [order, setOrder] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((current) => [
        current[1],
        current[2],
        current[0],
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-[2rem] bg-surface-muted p-3 sm:p-4">
      <motion.div
        layout
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {order.map((serviceIndex, position) => {
          const service = services[serviceIndex];
          const isLarge = position === 0;

          return (
            <motion.div
              key={service.number}
              layout
              transition={{
                layout: {
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className={isLarge ? "col-span-2" : "col-span-1"}
            >
              <Link
                href={service.href}
                className="group block overflow-hidden rounded-[1.5rem] bg-surface shadow-sm"
              >
                <motion.div
                  layout
                  transition={{
                    layout: {
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className={
                    isLarge
                      ? "relative aspect-[16/8] overflow-hidden"
                      : "relative aspect-square overflow-hidden"
                  }
                >
                  <HoverImage className="absolute inset-0 h-full w-full">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </HoverImage>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <motion.div
                    layout
                    className={
                      isLarge
                        ? "absolute bottom-0 left-0 p-5 text-white sm:p-6"
                        : "absolute bottom-0 left-0 p-4 text-white"
                    }
                  >
                    <p
                      className={
                        isLarge
                          ? "text-[10px] font-semibold uppercase tracking-[0.18em] text-kampurse-green-light"
                          : "text-[10px] font-semibold uppercase tracking-wider text-kampurse-green-light"
                      }
                    >
                      {service.title === "Find a Lodge"
                        ? "Lodges"
                        : service.title === "Buy & Sell"
                        ? "Marketplace"
                        : "Roommates"}
                    </p>

                    <p
                      className={
                        isLarge
                          ? "mt-1 text-xl font-semibold sm:text-2xl"
                          : "mt-1 font-semibold"
                      }
                    >
                      {service.title === "Find a Lodge"
                        ? "Find your next home"
                        : service.title === "Buy & Sell"
                        ? "Buy & sell"
                        : "Find your match"}
                    </p>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}