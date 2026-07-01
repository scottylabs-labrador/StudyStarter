"use client";

import { useDispatch } from "react-redux";
import { useProfileSummary } from "~/features/profile/hooks/useProfileSummary";
import { useAppSelector } from "~/lib/hooks";
import { setIsViewProfileOpen } from "~/lib/features/uiSlice";

interface CreateProfilePopUpProps {
  username: string;
  email: string;
}

const formatYear = (year?: string) => {
  if (!year) return "";
  return year.startsWith("2") ? `Class of ${year}` : year;
};

const CreateProfilePopUp: React.FC<CreateProfilePopUpProps> = ({ username, email }) => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);
  const profile = useProfileSummary(email, isOpen);
  const firstName = username.split(" ")[0] || username;

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
