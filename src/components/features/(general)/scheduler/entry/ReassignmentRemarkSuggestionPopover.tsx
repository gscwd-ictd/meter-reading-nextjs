// ReassignmentRemarkSuggestionPopover.tsx
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { Badge } from "@mr/components/ui/Badge";

interface ReassignmentRemarkSuggestionPopoverProps {
  remarks: string;
  onRemarksChange: (remarks: string) => void;
}

export default function ReassignmentRemarkSuggestionPopover({
  remarks,
  onRemarksChange,
}: ReassignmentRemarkSuggestionPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const suggestions = [
    "Reclass",
    "Forced Leave",
    "Vacation Leave",
    "Sick Leave",
    "Holiday",
    "Training",
    "Route Adjustment",
    "Emergency Reassignment",
    "Weather Conditions",
    "Equipment Maintenance",
    "Customer Request",
    "Area Inaccessibility",
    "Special Privilege Leave",
  ];

  const handleSuggestionSelect = (suggestion: string) => {
    onRemarksChange(suggestion);
    setIsPopoverOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="remarks">Remarks</Label>
      <div className="flex gap-2">
        <Input
          id="remarks"
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          placeholder="Enter remarks for this reassignment..."
          className="flex-1"
        />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-xs whitespace-nowrap">
              Suggestions
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end" onWheel={(e) => e.stopPropagation()}>
            <div className="grid gap-2">
              <div className="text-muted-foreground border-b pb-1 text-sm font-medium">
                Select a suggestion
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer px-3 py-1 transition-colors"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
