import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// A simple date range picker with a nice look for your app
export function DatePickerWithRange({ value, onChange }) {
  const [startDate, setStartDate] = useState(value?.[0] || null);
  const [endDate, setEndDate] = useState(value?.[1] || null);

  return (
    <DatePicker
      selected={startDate}
      onChange={dates => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        onChange && onChange([start, end]);
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      dateFormat="MMM d, yyyy"
      isClearable
      className="w-full px-2 py-2 border rounded-md"
      placeholderText="Select date range"
    />
  );
}
