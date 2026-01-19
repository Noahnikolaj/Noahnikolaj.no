"use client";

import React from "react";
import { ReactTyped } from "react-typed";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import Image from "next/image";
import { MailIcon } from "lucide-react";
import { Code, FileText } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Page = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }) // The times it takes for the carousel to rotate
  );

  const wheelGestures = WheelGesturesPlugin();

  /* The projects displayed in the carosel */
  const projects = [
    {
      title: "Dip - Badeapp",
      content: "En badeapp som gir tilgang til badeplasser i norge med ett interaktiv kart og point of interest i nærheten av badeplasser.",
      image: "/projectphotos/varapp.png",
      link: "/projects/1",
    },
    {
      title: "Bosett",
      content:
        "Bosett er en tidslinjebasert integreringsapp som hjelper innvandrere i Norge med å finne og forstå nødvendig informasjon på ett sted, og som reduserer integreringsstress gjennom en tydelig, brukersentrert steg-for-steg-opplevelse.",
      image: "/projectphotos/Bosett.png",
      link: "/projects/2",
    },
    {
      title: "PixiWorld",
      content:
        "En sosial medieplattform rettet mot barn og som har trygghet og barnas helse i fokus",
      image: "/projectphotos/Pixiworld.png",
      link: "/projects/3",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <header className="text-center my-5">
          <h1
            className="text-4xl font-light text-primary"
            style={{ fontFamily: "lemon" }}
          >
            {" "}
            <span className="font-bold">Hei Hei</span>
            {""}
            <ReactTyped
              startWhenVisible
              strings={[", hvem er jeg"]}
              startDelay={500}
              typeSpeed={100}
              loopCount={1}
              backSpeed={30}
              cursorChar="?"
              showCursor={true}
            />
          </h1>
        </header>

        <main className="text-center">
          <div className="  relative inline-block">
            <div className="absolute -inset-1 bg-chart-1 rounded-lg blur-2xl opacity-95 animate-pulse"></div>{" "}
            {/* Glowing effect */}
            <Card className="relative max-w-md mx-auto bg-card shadow-none outline-none rounded-l-2xl overflow-hidden border border-primary hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle
                  className="text-3xl font-bold text-secondary drop-shadow-md"
                  style={{
                    fontFamily: "lemon",
                    textShadow: "16px 16px 18px rgba(228, 100, 124, 1)",
                  }}
                >
                  Heisan - !
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-x-2 w-full">
                  <Image
                    src="/Profpic.png"
                    alt="Noah"
                    width={176}
                    height={176}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-grow max-w-[50%]">
                    <p
                      className="text-lg font-bold text-secondary leading-relaxed break-words whitespace-normal"
                      style={{ fontFamily: "lekton" }}
                    >
                      Hei, jeg er Noah! 21 år gammel{" "}
                      <ReactTyped
                        strings={[
                          "designer.",
                          "utvikler.",
                          "designer og utvikler.",
                        ]}
                        startDelay={4000}
                        typeSpeed={70}
                        backSpeed={30}
                        loopCount={2}
                      />
                      Interessert i å lære mer?
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter></CardFooter>
            </Card>
          </div>

          <div className="mt-12 space-x-6">
            <button
              className="inline-block px-4 py-2 text-base font-bold text-primary bg-background border border-primary rounded-lg hover:bg-primary hover:text-background hover:scale-105 transition-all cursor-pointer md:hover:(effekt)"
              style={{ fontFamily: "lekton" }}
            >
              <a href="https://www.linkedin.com/in/noah-nikolaj-klavestad-christensen-130568247/">
                LinkedIn
              </a>
            </button>

            <button
              className="inline-block px-4 py-2 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:bg-muted hover:border-muted hover:scale-105 transition-all cursor-pointer md:hover:(effekt)"
              style={{ fontFamily: "lekton" }}
            >
              <Link href="/cv">Min CV</Link>
            </button>
          </div>

          <div className="mt-52 space-x-16 relative">
            {" "}
            {/* make container relative for absolutely positioned controls */}
            <h2
              className="text-3xl font-light text-primary mb-2"
              style={{ fontFamily: "lemon" }}
            >
              Portefølje
            </h2>
            <Carousel
              plugins={[plugin.current, wheelGestures]}
              opts={{ loop: true, align: "start", slidesToScroll: 1 }}
              className="w-full max-w-5xl mx-auto flex justify-center mt-6 bg-background rounded-2xl px-6 py-8"
              onMouseEnter={() => plugin.current.stop()}
              onMouseLeave={() => plugin.current.play()}
            >
              <CarouselContent>
                {projects.map((project, index) => (
                  <CarouselItem key={index} className="basis-1/2 px-2">
                    <div className="p-2 hover:scale-105 transition-all cursor-pointer">
                      <Card className="bg-background shadow-none outline-none rounded-lg overflow-hidden border border-none">
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                          {/* Card content including image, title, and description */}
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={1000}
                            height={500}
                            quality={100}
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 48rem"
                            className="w-full h-72 sm:h-80 md:h-[24rem] object-cover rounded-lg border border-primary mb-2"
                          />
                          <div className="w-full text-left">
                            <h3 className="text-lg font-bold text-primary mt-2">
                              {project.title}
                            </h3>
                            <p className="squiggly-text mt-1">
                              {project.content}
                            </p>
                          </div>
                        </CardContent>

                        <CardFooter className="flex w-full gap-3 justify-center px-4 pb-4 mt-2">
                          <a
                            href={project.link + "/code"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="porteBtn"
                          >
                            <Code size={16} />
                            Code
                          </a>

                          <Link
                            href={project.link}
                            className="porteBtn"
                          >
                            <FileText size={16} />
                            Project
                          </Link>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-1 flex items-center justify-center bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition z-10">
                <ChevronLeft size={16} />
              </CarouselPrevious>

              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-1 flex items-center justify-center bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition z-10">
                <ChevronRight size={16} />
              </CarouselNext>
            </Carousel>
          </div>
        </main>

        <footer className="mt-24 text-center text-black flex items-center justify-center gap-2 py-4">
          <MailIcon size={16} />
          <span>Kontakt meg: noahnikolaj.c@gmail.com</span>
        </footer>
      </div>
    </div>
  );
};

export default Page;
