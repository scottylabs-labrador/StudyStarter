"use client";

import type { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerInput } from "~/components/ui/DatePickerInput";
import { CalendarDays, MapPin, Users } from "lucide-react";

type GroupModalFieldsProps = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  titleMaxLength: number;
  course: string;
  setCourse: Dispatch<SetStateAction<string>>;
  classes: string[];
  purpose: string;
  setPurpose: Dispatch<SetStateAction<string>>;
  date: Date | null | undefined;
  setDate: Dispatch<SetStateAction<Date | null | undefined>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  locationMaxLength: number;
  seats: string;
  setSeats: Dispatch<SetStateAction<string>>;
  details: string;
  setDetails: Dispatch<SetStateAction<string>>;
};

export function GroupModalFields({
  title,
  setTitle,
  titleMaxLength,
  course,
  setCourse,
  classes,
  purpose,
  setPurpose,
  date,
  setDate,
  location,
  setLocation,
  locationMaxLength,
  seats,
  setSeats,
  details,
  setDetails,
}: GroupModalFieldsProps) {
  return (
    <div className="group-form-fields">
      <label>Title <span>{title.length} / {titleMaxLength}</span><input className="form-control-accent" type="text" placeholder="Algorithms Study Session" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={titleMaxLength} /></label>
      <label>Course<select className="form-control" id="classSelect" value={course} onChange={(event) => setCourse(event.target.value)} required><option value="" disabled>Select a class</option>{classes.map((classId) => <option key={classId} value={classId}>{classId}</option>)}</select></label>
      <label>Purpose <span>{purpose.length} / 50</span><input className="form-control" type="text" placeholder="Review and practice" value={purpose} onChange={(event) => setPurpose(event.target.value)} required maxLength={50} /></label>
      <label className="form-icon-field"><CalendarDays size={15} />Date & time<DatePicker selected={date} onChange={(selectedDate) => setDate(selectedDate)} ariaLabelledBy="Date and time" showTimeSelect dateFormat="MMM d, yyyy · h:mm aa" placeholderText="Select a date and time" popperClassName="custom-popper" calendarClassName="bg-lightInput dark:bg-darkInput" customInput={<DatePickerInput />} wrapperClassName="w-full" className="w-full" required /></label>
      <div className="group-form-row">
        <label className="form-icon-field"><MapPin size={15} />Location <input className="form-control" type="text" placeholder="GHC 5403" value={location} onChange={(event) => setLocation(event.target.value)} required maxLength={locationMaxLength} /></label>
        <label className="form-icon-field"><Users size={15} />Max Capacity <input className="form-control" type="number" placeholder="6" value={seats} onChange={(event) => setSeats(event.target.value)} required min="2" max="100" /></label>
      </div>
      <label>Details <span>{details.length} / 200</span><input className="form-control" type="text" placeholder="We’ll practice sample problems together." value={details} maxLength={200} onChange={(event) => setDetails(event.target.value)} /></label>
    </div>
  );
}
