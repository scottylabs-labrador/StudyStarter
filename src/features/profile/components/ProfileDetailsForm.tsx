"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";

type ProfileDetailsFormProps = {
  userId?: string;
  compact?: boolean;
  mastersValue?: string;
};

type ProfileDetails = {
  year: string;
  majors: string;
  minors: string;
};

const defaultProfileDetails: ProfileDetails = {
  year: "default",
  majors: "",
  minors: "",
};

export function ProfileDetailsForm({
  userId,
  compact = false,
  mastersValue = "Masters Student",
}: ProfileDetailsFormProps) {
  const [profileDetails, setProfileDetails] = useState(defaultProfileDetails);
  const startYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 6 }, (_, index) => String(startYear + index)),
    [startYear],
  );
  const selectClassName = compact ? "profile-select-compact" : "profile-select";
  const inputClassName = compact ? "profile-input-compact" : "profile-input";

  useEffect(() => {
    if (!userId) return;

    const loadProfileDetails = async () => {
      try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const data = docSnap.data();
        setProfileDetails({
          year: data.year ?? "default",
          majors: data.majors ?? "",
          minors: data.minors ?? "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadProfileDetails();
  }, [userId]);

  const updateProfileDetails = async (updates: Partial<ProfileDetails>) => {
    setProfileDetails((currentDetails) => ({ ...currentDetails, ...updates }));

    if (!userId) return;

    try {
      const usersDocRef = doc(db, "Users", userId);
      await setDoc(usersDocRef, updates, { merge: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <select
          id="yearSelect"
          name="yearSelect"
          value={profileDetails.year}
          onChange={(event) => updateProfileDetails({ year: event.target.value })}
          className={selectClassName}
        >
          <option disabled value="default">
            Select Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              Class of {year}
            </option>
          ))}
          <option value={mastersValue}>Masters Student</option>
          <option value="PhD Student">PhD Student</option>
        </select>
      </div>
      <br />
      <hr className="text-darkbg dark:text-lightbg" />
      <br />
      <h1 className="text-l mb-1 font-bold text-black dark:text-white">Majors:</h1>
      <input
        id="majorInput"
        className={inputClassName}
        type="text"
        value={profileDetails.majors}
        onChange={(event) => updateProfileDetails({ majors: event.target.value })}
        placeholder="Add your major(s) here"
        required
      />
      <br />
      <br />
      <h1 className="text-l mb-1 font-bold text-black dark:text-white">Minors:</h1>
      <input
        id="minorInput"
        className={`${inputClassName} mb-3`}
        type="text"
        value={profileDetails.minors}
        onChange={(event) => updateProfileDetails({ minors: event.target.value })}
        placeholder="Add any minors or concentrations here"
      />
      <br />
      <br />
      <hr className="text-darkbg dark:text-lightbg" />
    </>
  );
}
