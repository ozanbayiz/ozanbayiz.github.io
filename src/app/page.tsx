"use client"

import OzanSection from "./components/OzanSection";
import SocialLinks from "./components/SocialLinks";
import TopAscii from "./components/TopAscii";
import ProjectSection from "./components/ProjectSection";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto container p-4">

      {/* ascii art*/}
      <TopAscii />

      {/* middle line */}
      <div className="w-screen border-t-2 border-foreground border-dashed"></div>

      <SocialLinks />

      <div className="w-screen border-t-2 border-foreground border-dashed"></div>

      <OzanSection />

      <div className="w-screen border-t-2 border-foreground border-dashed"></div>

      <ProjectSection />

    </div>
  );
}
