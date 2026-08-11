import Select, { type MultiValue, type StylesConfig } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProfileMenu } from "~/components/ui/ProfileMenu";

type FilterOption = { value: string; label: string };

const customSelectComponents = {
  ClearIndicator: () => null,
};

const customSelectStyles: StylesConfig<FilterOption, true> = {
  input: (provided) => ({
    ...provided,
    color: "#000",
  }),
  control: (provided, state) => ({
    ...provided,
    height: "46px",
    minHeight: "46px",
    backgroundColor: "var(--filter-input-background)",
    borderColor: "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #1a73e8" : "none",
    borderRadius: "4px",
    padding: "0 4px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#DDEAF0" : "#DDEAF0",
    borderRadius: "5px",
    padding: "2px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#000",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#842029" : "#6c757d",
    ":hover": {
      backgroundColor: "#f8d7da",
      color: "#842029",
    },
  }),
};

interface TopFilterBarProps {
  courseOptions: FilterOption[];
  selectedCourses: MultiValue<FilterOption>;
  setSelectedCourses: (selected: MultiValue<FilterOption>) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

function TopFilterBar({
  courseOptions,
  selectedCourses,
  setSelectedCourses,
  selectedDate,
  setSelectedDate,
}: TopFilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <Select
          isMulti
          options={courseOptions}
          value={selectedCourses}
          onChange={setSelectedCourses}
          classNamePrefix="react-select"
          className="filter-course-select"
          placeholder="Courses"
          styles={customSelectStyles}
          components={customSelectComponents}
        />

        <div className="filter-date-control">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={<input />}
            popperClassName="custom-popper"
            wrapperClassName="filter-date-wrapper"
            placeholderText="Date"
            className="filter-date-input"
          />
        </div>

        <ProfileMenu />
      </div>
    </div>
  );
}

export default TopFilterBar;
