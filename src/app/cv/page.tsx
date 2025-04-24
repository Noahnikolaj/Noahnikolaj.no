"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {MailIcon } from "lucide-react";

const CVPage = () => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-background px-6 py-12">
            {/* Profil */}
            <Card className="w-80 max-w-4xl h-auto text-center bg-card p-6 rounded-lg shadow-md">
                <CardHeader>
                    <Image
                        src="/andreprofil.png"
                        alt="Noah"
                        width={170}
                        height={170}
                        className="w-32 h-32 mx-auto rounded-3xl border-4 border-secondary"
                    />

                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold text-secondary">
                        Hei! Jeg er Noah, en student hos UiO, der jeg fullfører en Bachelor i Informatikk: Design, bruk og interaksjon :)
                    </p>
                </CardContent>
            </Card>

            {/* 3 Column Grid Kort*/}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {/* Utdanning */}
                <Card className="p-6 bg-card-foreground border-none hover:scale-105 transition-all cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-chart-2">Utdanning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-chart-2">Høyere utdanning</p>
                        <p className="text-chart-3">UiO Bachelor i Informatikk: Design, bruk og interaksjon</p>
                        <p className="text-sm text-muted-foreground">(aug. 2022 - juni 2025)</p>

                        <p className="mt-4 font-bold text-chart-2">Utdanningsutveksling</p>
                        <p className="text-chart-3">Korea University</p>
                        <p className="text-sm text-muted-foreground">(sep. 2024 - des. 2024)</p>

                        <p className="mt-4 font-bold text-chart-2">Videregående skole</p>
                        <p className="text-chart-3">Glemmen VGS: Media og kommunikasjon</p>
                        <p className="text-sm text-muted-foreground">(aug. 2019 - juni 2022)</p>

                        <p className="mt-4 text-xl font-bold text-chart-2">Annen kompetanse</p>
                        <p className="text-chart-3">Språk</p>
                        <li className="text-sm text-chart-3">Norsk (morsmål)</li>
                        <li className="text-sm text-chart-3">Engelsk (Akademisk nivå)</li>
                        <li className="text-sm text-chart-3">Koreansk (Nybegynner)</li>

                        <p className="text-chart-3">Førerkort</p>
                        <li className="text-sm text-chart-3">Klasse B</li>
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="p-6 bg-card-foreground border-none hover:scale-105 transition-all cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-chart-2">Verktøy & Kompetanse</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-chart-2">Programmeringsspråk</p>
                        <li className="text-sm text-chart-3">Python</li>
                        <li className="text-sm text-chart-3">Java</li>
                        <li className="text-sm text-chart-3">Kotlin</li>
                        <li className="text-sm text-chart-3">React, HTML, CSS, Next.js</li>

                        <p className="mt-4 font-bold text-chart-2">Utviklingsverktøy</p>
                        <li className="text-sm text-chart-3">Android Studio</li>
                        <li className="text-sm text-chart-3">Jetpack Compose</li>
                        <li className="text-sm text-chart-3">Linux, Ubuntu, TrueNas Scale</li>
                        <li className="text-sm text-chart-3">Git/Github</li>
                        <li className="text-sm text-chart-3">Figma</li>

                        <p className="mt-4 font-bold text-chart-2">Medieverktøy</p>
                        <li className="text-sm text-chart-3">Adobe-pakken: InDesign, Illustrator, Photoshop, Lightroom, Premiere, Audition</li>
                        <li className="text-sm text-chart-3">Final Cut Pro</li>
                        <li className="text-sm text-chart-3">Blender</li>
                        <li className="text-sm text-chart-3">Procreate</li>
                        <li className="text-sm text-chart-3">Kompetanse med kamera og drone</li>

                    </CardContent>

                </Card>

                {/* Work Experience */}
                <Card className="p-6 bg-card-foreground border-none hover:scale-105 transition-all cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-chart-2">Arbeidserfaring</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-chart-2">Butikkmedarbeider</p>
                        <p className="text-sm text-chart-3">Narvesen Oslo S</p>
                        <p className="text-sm text-muted-foreground">(sep. 2022 - i dag)</p>

                        <p className="mt-4 font-bold text-chart-2">Editor og delt regi</p>
                        <p className="text-chart-3">Utdanningsforbundet</p>
                        <li className="text-sm text-chart-3">3 Videoer</li>
                        <p className="text-sm text-muted-foreground">(Mai 2022)</p>

                        <p className="mt-4 font-bold text-chart-2">Butikkmedarbeider</p>
                        <p className="text-sm text-chart-3">Rema 1000 Iseveien</p>
                        <p className="text-sm text-muted-foreground">(mai. 2021 - aug. 2022)</p>
                    </CardContent>
                </Card>
            </div>
                <div className="mt-12 space-x-8">
                    <button className="inline-block px-4 py-2 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:bg-muted hover:border-muted hover:scale-105 transition-all cursor-pointer" style={{ fontFamily: "lekton" }}>
                        <Link href="/">Tilbake</Link>
                    </button>
                </div>
            {/* Footer */}
            <footer className="mt-12 text-center text-primary flex flex-col items-center">
                <p className="text-sm">Kontakt meg:</p>
                <MailIcon size={16} />
                Mail: <strong>noahnikolaj.c@gmail.com</strong>
                <p className="text-sm text-primary">
                    Instagram:
                    <a
                        href="https://www.instagram.com/Handernoah"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-primary hover:underline"
                    >
                        @Handernoah
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default CVPage;