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


const Page = () => {

    return (
    <div className="flex flex-col min-h-screen">
        <div className="m-4 flex flex-col items-end justify-right">
            <ModeToggle />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <header className="text-center my-12">
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

            </main>

            <footer className="mt-auto text-center text-primary flex items-center justify-center gap-2 py-4">
                <MailIcon size={16} />
                <span>Kontakt meg: noahnikolaj.c@gmail.com</span>
            </footer>

        </div>
    </div>
    );
};

export default Page;