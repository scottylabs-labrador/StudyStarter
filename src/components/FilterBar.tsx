import React, { ChangeEvent } from "react";
import Select, { MultiValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClearIndicator } from "node_modules/react-select/dist/declarations/src/components/indicators";

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

const customComponents = {
  ClearIndicator: () => null, // Do not render the remove icon ("x")
};

const customStyles = {
  input: (provided: React.CSSProperties) => ({
    ...provided,
     // Change text color in the input area to black
      }),
      control: (provided: React.CSSProperties, state: { isFocused: boolean }) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#f0f5f7' : '#f0f5f7', // Background color for the select field
        borderColor: state.isFocused ? 'black' : 'black', // Border color when focused/unfocused
        boxShadow: state.isFocused ? '0 0 0 1px #1a73e8' : 'none', // Box shadow on focus
        borderRadius: '4px', // Adjust border radius if needed
        padding: '4px', // Adjust padding for a better look
      }),
      multiValue: (provided: React.CSSProperties, state: { isFocused: boolean }) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#DDEAF0' : '#DDEAF0', // Background color for the selected option
    // border: state.isFocused ? '1px solid #0f5132' : '1px solid #084298', // Border color for the selected option
    borderRadius: '5px', // Adjust border radius if needed
    padding: '2px', // Optional: Adjust padding for more spacing
  }),
  multiValueLabel: (provided: React.CSSProperties) => ({
    ...provided,
    color: '#000', // Text color for the label
  }),
  multiValueRemove: (provided: React.CSSProperties, state: { isFocused: boolean }) => ({
    ...provided,
    color: state.isFocused ? '#842029' : '#6c757d', // Icon color for remove button
    ':hover': {
      backgroundColor: '#f8d7da', // Background color on hover
      color: '#842029', // Text color on hover
    },
  }),
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
  selectedDate: string | undefined;
  setSelectedDate: (date: string | undefined) => void;
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
          className="mb-2 w-full rounded"
          placeholder="Courses"
          styles={customStyles}
          components={customComponents} // remove x
        />
        
        {/* <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="rounded-md border px-2 py-1.5 w-1000000"
          type="date"
          // placeholder="Date"
          customInput={
            <CustomDateInput
              onClear={() => setSelectedDate(null)}
            />
          }
        /> */}
        <input
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-2 w-full rounded border px-2 bg-lightInput"// top-0 z-10 w-full border-b-darkbg dark:border-b-lightbg border-b bg-lightbg dark:bg-darkbg px-6 py-4
          type="date"
          placeholder="Date"
          id="filterDate"
        />
      </div>
    </div>
  );
};

export default TopFilterBar;
