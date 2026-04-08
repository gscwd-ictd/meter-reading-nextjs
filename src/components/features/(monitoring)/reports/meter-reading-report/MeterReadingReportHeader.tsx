"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@mr/components/ui/Button";
import { FormControl, FormField, FormItem } from "@mr/components/ui/Form";
import { SearchMeterReaderCombobox } from "@mr/components/features/(general)/meter-readers/SearchMeterReaderCombobox";
import { YearMonthPicker } from "@mr/components/features/calendar/YearMonthPicker";
import { Spinner } from "@mr/components/ui/Spinner";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { ZonebookSearchCombobox } from "./ZonebookSearchCombobox";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@mr/lib/utils";

export function MeterReadingReportHeader() {
  const form = useFormContext();
  const { watch } = form;
  const { isGenerating } = useMeterReadingReportContext();
  const [showFilters, setShowFilters] = useState(false);

  const monthYear = watch("monthYear");
  const meterReader = watch("meterReader");
  const zone = watch("zone");
  const book = watch("book");

  const isFormValid = !!monthYear;
  const activeFiltersCount = [meterReader, zone, book].filter(Boolean).length;

  const clearAllFilters = () => {
    form.setValue("meterReader", undefined);
    form.setValue("zone", "");
    form.setValue("book", "");
    form.clearErrors("book");
  };

  return (
    <div className="space-y-4">
      {/* Header with title on left, toggle buttons on right */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold">Meter Reading Report</h3>
          <div className="mt-1 h-1 w-12 bg-blue-500"></div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-700"
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{showFilters ? "Hide" : "Show"} Filters</span>
            {activeFiltersCount > 0 && !showFilters && (
              <span className="ml-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* All controls right-aligned */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Year Month Picker */}
        <div className="w-full sm:w-auto">
          <FormField
            control={form.control}
            name="monthYear"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <YearMonthPicker value={field.value} onChange={field.onChange} disabled={isGenerating} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Filters - collapsible */}
        {showFilters && (
          <>
            <div className="w-full sm:w-auto">
              <SearchMeterReaderCombobox disabled={isGenerating} />
            </div>
            <div className="w-full sm:w-auto">
              <ZonebookSearchCombobox disabled={isGenerating} />
            </div>
          </>
        )}

        {/* Generate Button */}
        <Button
          type="submit"
          className="h-10 w-full px-6 sm:w-auto dark:text-white"
          disabled={!isFormValid || isGenerating}
          form="meter-reading-report-form"
        >
          {isGenerating ? (
            <>
              Generating
              <Spinner className="ml-2" />
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </div>

      {/* Active filters badge when filters are hidden */}
      {!showFilters && activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-2 rounded-md bg-blue-50 p-2 text-sm">
          <Filter className="h-3 w-3 text-blue-500" />
          <span className="text-xs text-gray-600">
            {activeFiltersCount} active filter{activeFiltersCount !== 1 ? "s" : ""}
          </span>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => setShowFilters(true)}
          >
            Show filters
          </Button>
        </div>
      )}
    </div>
  );
}
