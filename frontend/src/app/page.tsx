import Link from "next/link";

import FeaturedListings from "@/components/FeaturedListings";
import HowItWorks from "@/components/HowItWorks";
import HeroServiceCards from "@/components/HeroServiceCards";

import {
  ButtonMotion,
  FadeUp,
  Float,
  HeroFade,
  HeroSlide,
  HoverImage,
  HoverLift,
  MotionExplore,
  MotionPulse,
} from "@/components/PageMotion";

const services = [
  {
    number: "01",
    title: "Find a Lodge",
    description:
      "Discover student-friendly lodges around campus and find a place that feels right for you.",
    href: "/lodges",
    image: "/hero/lodges.jpg",
  },
  {
    number: "02",
    title: "Buy & Sell",
    description:
      "Buy useful items or sell things you no longer need to students around your campus.",
    href: "/marketplace",
    image: "/hero/marketplace.png",
  },
  {
    number: "03",
    title: "Find a Roommate",
    description:
      "Connect with students looking for roommates and find someone compatible with you.",
    href: "/roommates",
    image: "/hero/roommate.jpg",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="kampurse-hero bg-surface-muted">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-0">
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            {/* Hero content */}
            <div className="max-w-2xl">
              <HeroFade delay={0.05}>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-kampurse-green/20 bg-kampurse-green-light px-4 py-2 text-xs font-semibold uppercase tracking-wider text-kampurse-green-dark">
                  <MotionPulse />
                  Built for campus life
                </div>
              </HeroFade>

              <HeroFade delay={0.15}>
                <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                  Shopping life
                  <br />
                  <span className="text-kampurse-green">
                    made simpler.
                  </span>
                </h1>
              </HeroFade>

              <HeroFade delay={0.25}>
                <p className="mt-7 max-w-xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
                  Find a lodge, buy and sell items, or connect with roommates
                  around your campus all from one simple platform.
                </p>
              </HeroFade>

              <HeroFade delay={0.35}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonMotion>
                    <Link
                      href="/lodges"
                      className="block rounded-lg bg-kampurse-green px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-kampurse-green-dark"
                    >
                      Find a Lodge
                    </Link>
                  </ButtonMotion>

                  <ButtonMotion>
                    <Link
                      href="/marketplace"
                      className="block rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-kampurse-green/40 hover:bg-surface-muted"
                    >
                      Shop Now
                    </Link>
                  </ButtonMotion>
                </div>
              </HeroFade>

              <HeroFade delay={0.45}>
                <div className="mt-12 flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      01
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Platform
                    </p>
                  </div>

                  <div className="h-9 w-px bg-border" />

                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      03
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Ways to connect
                    </p>
                  </div>

                  <div className="h-9 w-px bg-border" />

                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      100+
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Completed Transactions
                    </p>
                  </div>
                </div>
              </HeroFade>
            </div>

            {/* Hero visual */}
            {/* Hero visual */}
            <HeroSlide delay={0.2}>
              <Float>
                <div className="relative">
                  <HeroServiceCards services={services} />
                </div>
              </Float>
            </HeroSlide>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="bg-background">
        <FadeUp>
          <FeaturedListings />
        </FadeUp>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border bg-surface-muted">
        <FadeUp>
          <HowItWorks />
        </FadeUp>
      </section>

    </main>
  );
}