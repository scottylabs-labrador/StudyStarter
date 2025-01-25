import React from "react";
import Select, { MultiValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TopFilterBarProps {
  courseOptions: { value: string; label: string }[];
  locationOptions: { value: string; label: string }[];
  selectedCourses: MultiValue<{ value: string; label: string }>;
  setSelectedCourses: (
    selected: MultiValue<{ value: string; label: string }>,
  ) => void;
  selectedLocations: MultiValue<{ value: string; label: string }>;
  setSelectedLocations: (
    selected: MultiValue<{ value: string; label: string }>,
  ) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const TopFilterBar: React.FC<TopFilterBarProps> = ({
  courseOptions,
  locationOptions,
  selectedCourses,
  setSelectedCourses,
  selectedLocations,
  setSelectedLocations,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="border-gray-200 dark:border-gray-700 fixed top-0 z-10 w-full border-b bg-white px-6 py-4  dark:bg-darkbg">
      <div className="flex space-x-4">
        <Select
          isMulti
          options={courseOptions}
          value={selectedCourses}
          onChange={setSelectedCourses}
          classNamePrefix="react-select"
          placeholder="Courses"
        />
        <Select
          isMulti
          options={locationOptions}
          value={selectedLocations}
          onChange={setSelectedLocations}
          classNamePrefix="react-select"
          placeholder="Locations"
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="rounded-md border px-2 py-1.5"
          placeholderText="Date"
        />
      </div>
    </div>
  );
};

export default TopFilterBar;
