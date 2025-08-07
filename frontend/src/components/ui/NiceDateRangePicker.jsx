// src/components/ui/NiceDateRangePicker.jsx
import React from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function NiceDateRangePicker({ value, onChange }) {
  const [range, setRange] = React.useState({
    startDate: value?.[0] || new Date(),
    endDate: value?.[1] || new Date(),
    key: "selection",
  });

  React.useEffect(() => {
    setRange({
      startDate: value?.[0] || new Date(),
      endDate: value?.[1] || new Date(),
      key: "selection",
    });
  }, [value]);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden w-full max-w-xs mx-auto">
      <DateRange
        ranges={[range]}
        onChange={(item) => {
          setRange(item.selection);
          onChange([item.selection.startDate, item.selection.endDate]);
        }}
        moveRangeOnFirstSelection={false}
        maxDate={new Date()}
        rangeColors={["#182B31"]}
        showDateDisplay={false}
      />
    </div>
  );
}
