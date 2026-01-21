"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@mr/components/ui/Button";
import { FormControl, FormField, FormItem } from "@mr/components/ui/Form";
import { SearchMeterReaderCombobox } from "@mr/components/features/(general)/meter-readers/SearchMeterReaderCombobox";
import { YearMonthPicker } from "@mr/components/features/calendar/YearMonthPicker";
import { Spinner } from "@mr/components/ui/Spinner";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";

export function MeterReadingReportHeader() {
  const form = useFormContext();
  const { watch } = form;
  const { isGenerating } = useMeterReadingReportContext();

  const monthYear = watch("monthYear");

  const isFormValid = monthYear;
  return (
    <div className="grid flex-shrink-0 grid-cols-1 items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <div>
        <h3 className="mt-5 text-xl font-bold">Meter Reading Report</h3>
        <div className="mb-5 text-base font-medium text-gray-400"></div>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
        {/* Date Range Field */}
        <div className="flex-1">
          <FormField
            control={form.control}
            name="monthYear"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <YearMonthPicker value={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Meter Reader Field */}
        <div className="">
          <SearchMeterReaderCombobox />
        </div>

        {/* Submit Button */}
        <div className="lg:w-auto">
          <Button
            type="submit"
            className="h-[2.5rem] w-full px-6 lg:w-auto dark:text-white"
            size="sm"
            disabled={!isFormValid || isGenerating}
            form="meter-reading-report-form"
          >
            {isGenerating ? (
              <>
                Generating
                <Spinner />
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
