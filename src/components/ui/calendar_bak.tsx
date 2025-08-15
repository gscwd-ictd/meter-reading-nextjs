"use client";

import * as React from "react";
import { DayPicker, Chevron, NavProps, PreviousMonthButton, NextMonthButton } from "react-day-picker";
import { cn } from "@mr/lib/utils";
import { buttonVariants } from "@mr/components/ui/Button";

function CustomNav({ onPreviousClick, onNextClick, previousMonth, nextMonth }: NavProps) {
  return (
    <div className="flex w-full items-center justify-between px-2 py-1">
      <button
        type="button"
        onClick={onPreviousClick}
        disabled={!previousMonth}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        )}
      >
        <Chevron orientation="left" className="size-4" />
      </button>

      <span className="text-sm font-medium">
        {/* displayMonth isn't passed by NavProps, but DaysPicker will center caption automatically */}
      </span>

      <button
        type="button"
        onClick={onNextClick}
        disabled={!nextMonth}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        )}
      >
        <Chevron orientation="right" className="size-4" />
      </button>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  navLayout = "around",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      navLayout={navLayout}
      className={cn("p-3", className)}
      classNames={{ ...classNames }}
      components={{
        Nav: CustomNav,
        PreviousMonthButton,
        NextMonthButton,
        Chevron,
      }}
      {...props}
    />
  );
}

export { Calendar };
