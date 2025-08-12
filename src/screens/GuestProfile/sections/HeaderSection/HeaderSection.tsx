import React from "react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

export const HeaderSection = (): JSX.Element => {
  return (
    <header className="flex items-center justify-between px-12 py-2.5 fixed top-0 left-0 w-full bg-[#d9dbe0] shadow-[0px_1px_12px_#0000000f] z-10">
      {/* Left section with back button */}
      <div className="flex items-center flex-1">
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-[#2753eb] text-sm hover:no-underline"
        >
          <span className="font-['Roboto',Helvetica]">Back To Guest List</span>
        </Button>
      </div>

      {/* Center section with title */}
      <div className="flex items-center justify-center flex-1">
        <h1 className="font-['Roboto',Helvetica] font-medium text-[#030303] text-xl tracking-[0] leading-6">
          Guest Information
        </h1>
      </div>

      {/* Right section with notifications and avatar */}
      <div className="flex items-center justify-end gap-2.5 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="relative w-[75px] h-5">
            <div className="relative h-5 -top-px">
              <div className="absolute h-5 top-0 left-0 text-[#2f4bb7] text-[13px] tracking-[-0.29px] leading-[19.5px] font-['Roboto',Helvetica] font-normal text-center whitespace-nowrap">
                What&apos;s New?
              </div>
              <div className="absolute w-[7px] h-[7px] top-1 left-[68px] bg-[#de186c] rounded-[20px]" />
            </div>
          </div>

          <Separator orientation="vertical" className="h-[19px] bg-gray-300" />
        </div>

        <Avatar className="w-8 h-8 bg-[#414171] rounded-2xl">
          <AvatarFallback className="font-['Roboto',Helvetica] font-normal text-white text-sm">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
