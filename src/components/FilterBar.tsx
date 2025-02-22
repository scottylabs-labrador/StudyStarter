import React from "react";
import Select, { MultiValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onClear?: () => void;
}

const CustomDateInput: React.FC<CustomInputProps> = ({ value, onClick, onClear }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value || ""}
        onClick={onClick}
        readOnly
        placeholder="Date"
        className="rounded-md border px-2 py-1.5"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
        >&times;
        </button>
      )}
    </div>
  );
};

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
    <div className="top-0 z-10 w-full border-b-darkbg dark:border-b-lightbg border-b bg-lightbg dark:bg-darkbg px-6 py-4">
      <div className="flex space-x-4">
        <Select
          isMulti
          options={courseOptions}
          value={selectedCourses}
          onChange={setSelectedCourses}
          classNamePrefix="react-select"
          placeholder="Courses"
        />
        
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="rounded-md border px-2 py-1.5"
          type="date"
          // placeholder="Date"
          customInput={
            <CustomDateInput
              onClear={() => setSelectedDate(null)}
            />
          }
        />
      </div>
    </div>
  );
};

export default TopFilterBar;
