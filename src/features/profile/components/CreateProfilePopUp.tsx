"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "~/lib/hooks";
import { setIsViewProfileOpen } from "~/lib/features/uiSlice";
import { db } from "~/lib/api/firebaseConfig";

interface CreateProfilePopUpProps {
  username: string;
  email: string;
}

type ProfileSummary = {
  year?: string;
  majors?: string;
  minors?: string;
};

const formatYear = (year?: string) => {
  if (!year) return "";
  return year.startsWith("2") ? `Class of ${year}` : year;
};

const CreateProfilePopUp: React.FC<CreateProfilePopUpProps> = ({ username, email }) => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);
  const [profile, setProfile] = useState<ProfileSummary>({});
  const firstName = username.split(" ")[0] || username;

  useEffect(() => {
    if (!isOpen || !email) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "Users", email);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.warn("No such document!");
          setProfile({});
          return;
        }

        const data = docSnap.data();
        setProfile({
          year: data.year,
          majors: data.majors,
          minors: data.minors,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, [email, isOpen]);

  const handleClose = () => {
    dispatch(setIsViewProfileOpen(false));
  };

  if (!isOpen) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup-panel">
        <div className="profile-popup-header">
          <div className="text-black dark:text-white">
            <h2 className="text-xl font-bold">
              <big>{firstName}</big>
            </h2>
            <p className="text-l">{email}</p>
            {profile.year && <p className="font-bold">{formatYear(profile.year)}</p>}
            {profile.majors && (
              <p>
                <strong>Majors: </strong>
                {profile.majors}
              </p>
            )}
            {profile.minors && (
              <p>
                <strong>Minors: </strong>
                {profile.minors}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="profile-popup-close">
            <big>&times;</big>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePopUp;
