import React, { useEffect, useRef, useState } from "react";
import { SignOutButton, useUser } from "~/lib/auth-client";
import Select, { MultiValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
          classNamePrefix="react-datepicker"
          className="filter-select"
        />

        {/* Profile Button - Hidden on small screens */}
        <div
          ref={profileMenuRef}
          className="profile-menu-container"
        >
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="avatar-button"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >{user && user.image && (
            <img
              src={user?.imageUrl || "https://via.placeholder.com/80"}
              alt="Profile"
              className="rounded-full"
            />
          )} 
          {user && !user.image && (
            <div
              className="avatar-fallback"
              >{user.firstName[0]}
            </div>
          )}
          {!user && (
            <div
              className="avatar-label"
              >Profile
            </div>
          )}
          </button>
          {isProfileMenuOpen && (
            <div className="profile-menu">
              <a
                href="/profile"
                className="profile-menu-item"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Profile
              </a>
              <SignOutButton>
                <button
                  type="button"
                  className="profile-menu-item"
                >
                  Logout
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar;
