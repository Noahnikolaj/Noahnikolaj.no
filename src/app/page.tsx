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
import { ArchiveIcon } from "@/components/ui/archive";
import { LinkedinIcon } from "@/components/ui/linkedin";
import Link from "next/link";
import Image from "next/image";
import { MailIcon } from "lucide-react";
import { Code, FileText, Figma } from "lucide-react";
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
  const linkedinIconRef = React.useRef<any>(null);

  /* The projects displayed in the carosel */
  const projects = [

    {
      title: "Bosett",
      content:
        "Bosett er en tidslinjebasert integreringsapp som hjelper innvandrere i Norge med å finne og forstå nødvendig informasjon på ett sted, og som reduserer integreringsstress gjennom en tydelig, brukersentrert steg-for-steg-opplevelse.",
      image: "/projectphotos/Bosett.png",
      link: "/bosett",
      buttonType: "figma",
    },
    {
      title: "PixiWorld",
      content:
        "En sosial medieplattform rettet mot barn og som har trygghet og barnas helse i fokus",
      image: "/projectphotos/Pixiworld.png",
      link: "/projects/3",
      codeLink: "https://github.com/Noahnikolaj/PixiWorld_SocialNetworkExam/tree/main",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden pt-20 md:pt-0">
      {/*
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      */}

      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <header className="text-center my-5">
          <h1
            className="text-3xl md:text-4xl font-light text-primary"
            style={{ fontFamily: "Lemon" }}
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

        <main className="text-center w-full">
          <div className="relative w-full max-w-md mx-auto px-6">
            <div className="absolute -inset-1 bg-chart-1 rounded-lg blur-2xl opacity-95 animate-pulse"></div>{" "}
            {/* Glowing effect */}
            <Card className="relative max-w-md mx-auto bg-card shadow-none outline-none rounded-l-2xl overflow-hidden border border-primary md:hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle
                  className="text-2xl md:text-3xl font-bold text-secondary drop-shadow-md"
                  style={{
                    fontFamily: "Lemon",
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
                    className="rounded-full flex-shrink-0 w-32 h-32 md:w-44 md:h-44"
                  />
                  <div className="flex-grow max-w-[50%]">
                    <p
                      className="text-base md:text-lg font-bold text-secondary leading-relaxed break-words whitespace-normal"
                      style={{ fontFamily: "Lekton" }}
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
              className="glowing-btn font-bold transition-all cursor-pointer"
              style={{ fontFamily: "Lekton" }}
              onMouseEnter={() => linkedinIconRef.current?.startAnimation()}
              onMouseLeave={() => linkedinIconRef.current?.stopAnimation()}
            >
              <LinkedinIcon ref={linkedinIconRef} size={20} className="glowing-txt" />
              <a href="https://www.linkedin.com/in/noah-nikolaj-klavestad-christensen-130568247/" className="pt-1 flex">
                <span className="glowing-txt">Lin<span className="faulty-letter">k</span>edI<span className="faulty-letter">n</span></span>
              </a>
            </button>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:text-primary hover:bg-secondary hover:border-secondary hover:scale-110 transition-all cursor-pointer md:hover:(effekt)"
              style={{ fontFamily: "Lekton" }}
            >
              <ArchiveIcon size={20} />
              <Link href="/cv" className="pt-1">Min CV</Link>
            </button>
          </div>

          <div className="mt-24 md:mt-52 relative">
            {/* make container relative for absolutely positioned controls */}
            <h2
              className="text-3xl font-light text-primary mb-2"
              style={{ fontFamily: "Lemon" }}
            >
              Projekter
            </h2>
            <Carousel
              plugins={[plugin.current, wheelGestures]}
              opts={{ loop: true, align: "start", slidesToScroll: 1 }}
              className="w-[85%] md:w-full max-w-5xl mx-auto mt-6 bg-background rounded-2xl px-6 py-8"
              onMouseEnter={() => plugin.current?.stop()}
              onMouseLeave={() => plugin.current?.play()}
            >
              <CarouselContent>
                {projects.map((project, index) => (
                  <CarouselItem key={index} className="basis-full md:basis-1/2 px-2">
                    <div className="p-2 md:hover:scale-105 transition-all cursor-pointer">
                      <Card className="bg-background shadow-none outline-none rounded-lg overflow-hidden border border-none">
                        <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 gap-2">
                          {/* Card content including image, title, and description */}
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={1000}
                            height={500}
                            quality={100}
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 48rem"
                            className="w-full h-48 md:h-[24rem] object-cover rounded-lg border border-primary mb-2"
                          />
                          <div className="w-full text-left">
                            <h3 className="text-lg font-bold text-primary mt-2">
                              {project.title}
                            </h3>
                            <p className="bg-secondary text-chart-2 p-3 md:p-4 rounded-xl shadow-sm mt-1 text-sm md:text-base">
                              {project.content}
                            </p>
                          </div>
                        </CardContent>

                        <CardFooter className="flex w-full gap-3 justify-center px-4 pb-4 mt-2">
                          {project.buttonType === "figma" ? (
                            <Link
                              href={project.link}
                              className="porteBtn"
                            >
                              <Figma size={16} />
                              Design
                            </Link>
                          ) : (
                            <a
                              href={project.codeLink || project.link + "/code"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="porteBtn"
                            >
                              <Code size={16} />
                              Code
                            </a>
                          )}

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
              <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-1 items-center justify-center bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition z-10">
                <ChevronLeft size={16} />
              </CarouselPrevious>

              <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-1 items-center justify-center bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition z-10">
                <ChevronRight size={16} />
              </CarouselNext>
            </Carousel>
          </div>
        </main>

        <footer className="w-full mt-40 md:mt-64 bg-primary text-secondary flex items-center justify-center gap-2 py-12">
          <MailIcon size={20} />
          <span className="text-lg font-medium" style={{ fontFamily: "Lekton" }}>Kontakt meg: noahnikolaj.c@gmail.com</span>
        </footer>
      </div>
    </div>
  );
};

export default Page;
