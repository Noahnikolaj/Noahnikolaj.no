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
import {ModeToggle} from "@/components/ModeToggle";
import Link from "next/link";
import Image from "next/image";
import {MailIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";



const Page = () => {

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false}) // The times it takes for the carousel to rotate
    )

    const wheelGestures = WheelGesturesPlugin()

    /* The projects displayed in the carosel */
    const projects = [
        { title: "Nettside",content: "My name is Pink and I'm really glad to meet you", image: "/projectphotos/img.png", link: "/projects/1" },
        { title: "Designsystem",content: "You're recommended to me by some people\n" + "Hey, ooh, is this illegal?", image: "/projectphotos/img.png", link: "/projects/2" },
        { title: "En annen side",content: "Hey, ooh, it feels illegal (Ha)\n" + "I've suffered quite a few times with paranoia\n" + "Oh, what's your name? I don't know what I should call ya", image: "/projectphotos/img.png", link: "/projects/3" },
    ];

    return (
    <div className="flex flex-col min-h-screen">
        <div className="m-4 flex flex-col items-end justify-right">
            <ModeToggle />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <header className="text-center my-5">
                <h1 className="text-4xl font-light text-primary" style={{ fontFamily: "lemon" }}> <span className="font-bold">Hei Hei</span>{""}
                    <ReactTyped startWhenVisible
                    strings={[", hvem er jeg"]}
                    startDelay={500}
                    typeSpeed={100}
                    loopCount={1}
                    backSpeed={30}
                    cursorChar="?"
                    showCursor={true}
                /></h1>
            </header>

            <main className="text-center">
                <div className="relative">
                    <div className="absolute -inset-1 bg-chart-1 rounded-lg blur-2xl opacity-95 animate-pulse"></div> {/* Glowing effect */}

                    <Card className="relative max-w-md mx-auto bg-card shadow-none outline-none rounded-l-2xl overflow-hidden border border-primary hover:scale-105 transition-all cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-secondary drop-shadow-md" style={{ fontFamily: "lemon", textShadow: "16px 16px 18px rgba(228, 100, 124, 1)" }}>
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
                                    <p className="text-lg font-bold text-secondary leading-relaxed break-words whitespace-normal" style={{ fontFamily: "lekton" }}>
                                        Hei, jeg er Noah! 21 år gammel{" "}
                                        <ReactTyped
                                            strings={["designer.", "utvikler.", "designer og utvikler."]}
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

                <div className="mt-12 space-x-8">
                <button className="inline-block px-4 py-2 text-base font-bold text-primary bg-background border border-primary rounded-lg hover:bg-primary hover:text-background hover:scale-105 transition-all cursor-pointer md:hover:(effekt)" style={{ fontFamily: "lekton" }}>
                    <a href="https://www.linkedin.com/in/noah-nikolaj-klavestad-christensen-130568247/">LinkedIn</a>
                </button>

                <button className="inline-block px-4 py-2 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:bg-muted hover:border-muted hover:scale-105 transition-all cursor-pointer md:hover:(effekt)" style={{ fontFamily: "lekton" }}>
                    <Link href="/cv">Min CV</Link>
                </button>
                </div>

                <div className="mt-52 space-x-16">
                    <h2 className="text-3xl font-light text-primary mb-2" style={{ fontFamily: "lemon" }}> <span className="font-bold">Hva har jeg jobbet med?</span></h2>
                    <Carousel
                        plugins={[plugin.current, wheelGestures]}
                        opts={{ loop: true }}
                        className="w-full max-w-xs flex justify-center mt-2"
                        onMouseEnter={() => plugin.current.stop()}
                        onMouseLeave={() => plugin.current.play()}
                    >
                        <CarouselContent>
                            {projects.map((project, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-2 hover:scale-105 transition-all cursor-pointer">
                                        <Card>
                                            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-center">
                                                <Image src={project.image} alt={project.title} width={120} height={120} className="rounded-lg" />
                                                <h3 className="text-lg font-bold text-secondary">{project.title}</h3>
                                                <p className="text-sm text-secondary">{project.content}</p>
                                                <Link href={project.link} className="text-sm text-chart-2 underline">Se mer →</Link>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

            </main>

            <footer className="mt-24 text-center text-primary flex items-center justify-center gap-2 py-4">
                <MailIcon size={16} />
                <span>Kontakt meg: noahnikolaj.c@gmail.com</span>
            </footer>

        </div>
    </div>
    );
};

export default Page;