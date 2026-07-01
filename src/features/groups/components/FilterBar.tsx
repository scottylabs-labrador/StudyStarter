import React from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProfileMenu } from "~/components/ui/ProfileMenu";

type FilterOption = { value: string; label: string };

const customSelectComponents = {
  ClearIndicator: () => null, // Do not render the remove icon ("x")
};

const customSelectStyles: StylesConfig<FilterOption, true> = {
  input: (provided) => ({
    ...provided,
    color: '#000', // Change text color in the input area to black
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f5f7' : '#f0f5f7', // Background color for the select field
    borderColor: '#d1d5db', // Match profile input border color
    boxShadow: state.isFocused ? '0 0 0 1px #1a73e8' : 'none', // Box shadow on focus
    borderRadius: '4px', // Adjust border radius if needed
    padding: '4px', // Adjust padding for a better look
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#DDEAF0' : '#DDEAF0', // Background color for the selected option
    borderRadius: '5px', // Adjust border radius if needed
    padding: '2px', // Optional: Adjust padding for more spacing
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#000', // Text color for the label
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#842029' : '#6c757d', // Icon color for remove button
    ':hover': {
      backgroundColor: '#f8d7da', // Background color on hover
      color: '#842029', // Text color on hover
    },
  }),
};

interface TopFilterBarProps {
  courseOptions: FilterOption[];
  locationOptions: FilterOption[];
  selectedCourses: MultiValue<FilterOption>;
  setSelectedCourses: (
    selected: MultiValue<FilterOption>,
  ) => void;
  selectedLocations: MultiValue<FilterOption>;
  setSelectedLocations: (
    selected: MultiValue<FilterOption>,
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
    <div className="filter-bar">
      <div className="filter-controls">
        <Select
          isMulti
          options={courseOptions}
          value={selectedCourses}
          onChange={setSelectedCourses}
          classNamePrefix="react-select"
          className="filter-select"
          placeholder="Courses"
          styles={customSelectStyles}
          components={customSelectComponents} // remove x
        />
        
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          customInput={<input className="filter-date-input" />}
          popperClassName="custom-popper" // Class for popper customization
          placeholderText="Date"
          className="filter-select"
        />

        <ProfileMenu />
      </div>
    </div>
  );
};

export default TopFilterBar;
