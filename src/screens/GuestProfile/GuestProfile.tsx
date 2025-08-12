import React from "react";
import { GuestProfileSection } from "./sections/GuestProfileSection/GuestProfileSection";
import { HeaderSection } from "./sections/HeaderSection";

export const GuestProfile = (): JSX.Element => {
  return (
    <main className="bg-[#f1f2f8] flex flex-col items-center w-full min-h-screen">
      <div className="bg-[#f1f2f8] w-full max-w-[1440px]">
        <HeaderSection />
        <GuestProfileSection />
      </div>
    </main>
  );
};
