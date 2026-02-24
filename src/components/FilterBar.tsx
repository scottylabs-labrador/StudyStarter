import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
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

const customSelectComponents = {
  ClearIndicator: () => null, // Do not render the remove icon ("x")
};

const customSelectStyles = {
  input: (provided) => ({
    ...provided,
    color: '#000', // Change text color in the input area to black
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f5f7' : '#f0f5f7', // Background color for the select field
    borderColor: state.isFocused ? 'black' : 'black', // Border color when focused/unfocused
    boxShadow: state.isFocused ? '0 0 0 1px #1a73e8' : 'none', // Box shadow on focus
    borderRadius: '4px', // Adjust border radius if needed
    padding: '4px', // Adjust padding for a better look
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#DDEAF0' : '#DDEAF0', // Background color for the selected option
    // border: state.isFocused ? '1px solid #0f5132' : '1px solid #084298', // Border color for the selected option
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
  const [isFocused, setIsFocused] = useState(false); // State to track focus
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useUser();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);
  // Handler for focus event
  const handleFocus = () => {
    console.log("DatePicker is focused!");
    setIsFocused(true);
  };

  // Handle blur when calendar closes or input loses focus
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="top-0 z-10 w-full border-b-darkbg dark:border-b-lightbg border-b bg-lightbg dark:bg-darkbg px-6 py-4">
      <div className="flex space-x-4 justify-between w-full">
        <Select
          isMulti
          options={courseOptions}
          value={selectedCourses}
          onChange={setSelectedCourses}
          classNamePrefix="react-select"
          className="mb-2 rounded flex-1"
          placeholder="Courses"
          styles={customSelectStyles}
          components={customSelectComponents} // remove x
        />
        
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          customInput={<input style={{ 
            color: '#000', 
            backgroundColor: isFocused ? '#f0f5f7' : '#f0f5f7', // Background color for the select field
            borderColor: isFocused ? 'black' : 'black', // Border color when focused/unfocused
            boxShadow: isFocused ? '0 0 0 1px #1a73e8' : 'none', // Box shadow on focus
            borderRadius: '4px', // Adjust border radius if needed
            padding: '11px' 
          }} />} // Custom input styles
          popperClassName="custom-popper" // Class for popper customization
          placeholderText="Date"
          onFocus={handleFocus} // Focus event handler
          classNamePrefix="react-datepicker"
          className="mb-2 rounded flex-1"
          onCalendarClose={handleBlur} // Calendar closed (treat as blur)
          onBlur={handleBlur} // Trigger blur when input loses focus
        />

        {/* Profile Button - Hidden on small screens */}
        <div
          ref={profileMenuRef}
          className="relative hidden md:flex items-center"
          style={{ zIndex: 1000 }}
        >
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full dark:bg-darkAccent bg-lightButton shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >
            <img
              src={user?.imageUrl || "https://via.placeholder.com/80"}
              alt="Profile"
              className="rounded-full"
            />
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-40 overflow-hidden rounded-lg border border-lightAccent dark:border-darkAccent bg-lightbg dark:bg-darkbg shadow-lg">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-lightButton dark:hover:bg-darkButton transition"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Profile
              </a>
              <SignOutButton>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-black dark:text-white hover:bg-lightButton dark:hover:bg-darkButton transition"
                >
                  Logout
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
        {/* <input
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-2 w-full rounded border px-2 bg-lightInput"// top-0 z-10 w-full border-b-darkbg dark:border-b-lightbg border-b bg-lightbg dark:bg-darkbg px-6 py-4
          type="date"
          placeholder="Date"
          id="filterDate"
        /> */}
      </div>
    </div>
  );
};

export default TopFilterBar;
