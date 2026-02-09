"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { 
  MailIcon, 
  Code, 
  FileText, 
  Figma, 
  Server, 
  Terminal, 
  Box, 
  Coffee, 
  Atom, 
  FileCode, 
  Palette, 
  Globe, 
  Smartphone, 
  Layout, 
  GitGraph, 
  BookOpen, 
  PenTool, 
  Image as ImageIcon, 
  Camera, 
  Video, 
  Mic, 
  Film, 
  Cuboid, 
  Brush, 
  Aperture, 
  Languages 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileSnake } from "@/components/ProfileSnake";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";

const CVPage = () => {
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
      codeLink:
        "https://github.com/Noahnikolaj/PixiWorld_SocialNetworkExam/tree/main",
    },
  ];

  const getSkillIcon = (skill: string) => {
    const iconProps = { className: "mr-1 h-3 w-3" };
    switch (skill) {
      case "TrueNas Scale": return <Server {...iconProps} />;
      case "Ubuntu Server": return <Terminal {...iconProps} />;
      case "Docker": return <Box {...iconProps} />;
      case "Python": return <Code {...iconProps} />;
      case "Java": return <Code {...iconProps} />;
      case "Kotlin": return <Code {...iconProps} />;
      case "React": return <Atom {...iconProps} />;
      case "HTML": return <Code {...iconProps} />;
      case "CSS": return <Palette {...iconProps} />;
      case "Figma": return <Figma {...iconProps} />;
      case "Next.js": return <Globe {...iconProps} />;
      case "Android Studio": return <Smartphone {...iconProps} />;
      case "Jetpack Compose": return <Layout {...iconProps} />;
      case "Git/Github": return <GitGraph {...iconProps} />;
      case "InDesign": return <BookOpen {...iconProps} />;
      case "Illustrator": return <PenTool {...iconProps} />;
      case "Photoshop": return <ImageIcon {...iconProps} />;
      case "Lightroom": return <Camera {...iconProps} />;
      case "Premiere": return <Video {...iconProps} />;
      case "Audition": return <Mic {...iconProps} />;
      case "Final Cut Pro": return <Film {...iconProps} />;
      case "Blender": return <Cuboid {...iconProps} />;
      case "Procreate": return <Brush {...iconProps} />;
      case "Foto/Drone": return <Aperture {...iconProps} />;
      case "Norsk (Morsmål)":
      case "Engelsk (Akademisk)":
      case "Koreansk (Nybegynner)": return <Languages {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-12">
      {/* Profile Section with Glow Effect */}
      <div className="relative w-full max-w-md mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        <div className="absolute -inset-1 bg-chart-1 rounded-full blur-2xl opacity-60 animate-pulse md:hidden"></div>{" "}
        {/* Glow behind image - visible mostly on mobile or centered layout */}
        
        <div className="relative flex-shrink-0">
             <ProfileSnake>
               <Image
                  src="/andreprofil.png"
                  alt="Noah"
                  width={176}
                  height={176}
                  className="rounded-full flex-shrink-0 w-32 h-32 md:w-44 md:h-44 object-cover"
                />
             </ProfileSnake>
        </div>

        <div className="flex flex-col items-center md:items-start space-y-2 max-w-lg mt-2 md:mt-0">
             <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "Lemon" }}>
              Noah Klavestad-Christensen
            </h1>
            <p className="text-chart-3 font-medium text-center md:text-left" style={{ fontFamily: "Lekton" }}>
              Hei! Jeg er Noah, en student hos UiO, der jeg fullfører en Bachelor
              i Informatikk: Design, bruk og interaksjon :)
            </p>
          </div>
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        
        {/* Projects Section */}
        <section>
          <h2 className="text-2xl font-bold text-chart-2 mb-4 flex items-center gap-2">
            <Code className="size-6"/> Prosjekter
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-card-foreground border-none hover:scale-[1.02] transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-chart-2">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-start">
                   <Image
                        src={project.image}
                        alt={project.title}
                        width={300}
                        height={200}
                        className="rounded-md object-cover w-full md:w-48 h-32 border border-muted"
                      />
                  <div className="flex-1">
                      <p className="text-chart-2 font-medium text-sm md:text-base mb-4">
                        {project.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                          {project.buttonType === "figma" ? (
                            <Link href={project.link} className="porteBtn text-xs py-1 px-2">
                              <Figma size={14} /> Design
                            </Link>
                          ) : (
                             <a
                                href={project.codeLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="porteBtn text-xs py-1 px-2"
                              >
                                <Code size={14} /> Kode
                              </a>
                          )}
                           <Link href={project.link} className="porteBtn text-xs py-1 px-2">
                             <FileText size={14} /> Prosjekt
                           </Link>
                      </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-bold text-chart-2 mb-4">Utdanning</h2>
          <Card className="bg-card-foreground border-none">
            <CardContent className="space-y-6 pt-6">
              
              {/* Kristiania */}
              <div>
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-2">
                    <h3 className="font-bold text-chart-2 text-xl">Høyskolen Kristiania</h3>
                    <span className="text-sm text-muted-foreground font-medium">aug. 2025 - jun. 2027</span>
                </div>
                <p className="text-chart-2 font-medium mb-2">Master i Human Computer Interaction (HCI)</p>
                <p className="text-chart-2 font-medium text-sm leading-relaxed mb-3">
                  Jeg har en spesiell interesse for Virtual og artificial reality (VR og AR), samt kunstig intelligens. 
                  For tiden ønsker jeg å forske på hvordan vi kan anvende HCI-prinsipper i VR/AR-miljøer og AI-drevne systemer, 
                  for å gjøre dem mer tilgjengelige og menneskesentrerte.
                </p>
              </div>

              <Separator className="bg-chart-3" />

               {/* Korea University */}
               <div>
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-2">
                    <h3 className="font-bold text-chart-2 text-xl">Korea University</h3>
                    <span className="text-sm text-muted-foreground font-medium">sep. 2024 - des. 2024</span>
                </div>
                <p className="text-chart-2 font-medium mb-2">Exchange Student</p>
                <p className="text-chart-2 font-medium text-sm leading-relaxed mb-3">
                  Fikk tverrkulturelt perspektiv på UX og teknologi ved et av Koreas prestisjeskoler "SKY"-universitetene. 
                  Her fikk jeg observert koreanske designmønstre og "mobile-first" brukeropplevelser i et høyteknologisk samfunn bygd rundt mobiltelefoner.
                </p>
              </div>

              <Separator className="bg-chart-3" />

               {/* UiO */}
               <div>
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-2">
                    <h3 className="font-bold text-chart-2 text-xl">Universitetet i Oslo (UiO)</h3>
                    <span className="text-sm text-muted-foreground font-medium">aug. 2022 - jun. 2025</span>
                </div>
                <p className="text-chart-2 font-medium mb-2">Bachelor i Informatikk: Design, Bruk og Interaksjon</p>
                <p className="text-chart-2 font-medium text-sm leading-relaxed">
                  Gjennom min bachelorgrad ved Universitetet i Oslo (UiO) fordypet jeg meg i både Backend utvikling og brukerdesign. 
                  Jeg fikk mye verdifull, praktisk erfaring gjennom større prosjekter med fokus på Android-utvikling og smidig metodikk (Scrum).
                </p>
              </div>

            </CardContent>
          </Card>
        </section>
        


        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-bold text-chart-2 mb-4">Verktøy & Kompetanse</h2>
          <Card className="p-6 bg-card-foreground border-none">
            <CardContent className="space-y-6 pt-6">
              
              {/* Server Hosting */}
              <div>
                <h3 className="font-bold text-chart-2 mb-3">Server Hosting</h3>
                <div className="flex flex-wrap gap-2">
                  {["TrueNas Scale", "Ubuntu Server", "Docker"].map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-chart-3 hover:bg-secondary flex items-center">
                      {getSkillIcon(skill)}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-chart-3" />

              {/* Development Tools */}
              <div>
                <h3 className="font-bold text-chart-2 mb-3">Utvikling</h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "Java", "Kotlin", "HTML", "CSS", "Figma","React", "Next.js", "Android Studio", "Jetpack Compose", "Git/Github"].map((skill) => (
                    <Badge key={skill} variant="outline" className="text-chart-3 border-primary/30 flex items-center">
                      {getSkillIcon(skill)}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-chart-3" />

              {/* Media Tools */}
              <div>
                <h3 className="font-bold text-chart-2 mb-3">Kreative Verktøy</h3>
                <div className="flex flex-wrap gap-2">
                  {["InDesign", "Illustrator", "Photoshop", "Lightroom", "Premiere", "Audition", "Final Cut Pro", "Blender", "Procreate", "Foto/Drone"].map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-chart-3 hover:bg-secondary flex items-center">
                      {getSkillIcon(skill)}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
               <Separator className="bg-chart-3" />
               
               {/* Languages */}
               <div>
                <h3 className="font-bold text-chart-2 mb-3">Språk</h3>
                 <div className="flex flex-wrap gap-2">
                   {["Norsk (Morsmål)", "Engelsk (Akademisk)", "Koreansk (Nybegynner)"].map((skill) => (
                     <Badge key={skill} variant="secondary" className="text-chart-3 hover:bg-secondary flex items-center">
                        {getSkillIcon(skill)}
                        {skill}
                     </Badge>
                   ))}
                 </div>
               </div>

            </CardContent>
          </Card>
        </section>

      </div>

      <div className="mt-12 space-x-8">
        <button
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-secondary bg-input border border-primary rounded-lg hover:text-primary hover:bg-secondary hover:border-secondary hover:scale-105 transition-all cursor-pointer"
          style={{ fontFamily: "Lekton" }}
        >
          <ArrowLeftIcon size={20} />
          <Link href="/">Tilbake til Hjem</Link>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-primary flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
            <MailIcon size={18} />
            <span className="font-bold">noahnikolaj.c@gmail.com</span>
        </div>
        
        <div className="text-sm text-primary/80">
           <a
            href="https://www.instagram.com/Handernoah"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            Instagram: @Handernoah
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CVPage;