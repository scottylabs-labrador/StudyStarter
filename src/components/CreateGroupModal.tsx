import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import { useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function CreateGroupModal() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');
  const [details, setDetails] = useState('');
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCreateGroupModalOpen);

  const handleClose = () => {
    dispatch(setIsCreateGroupModalOpen(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupDocRef = doc(db, "Study Groups", title? title : "");
      setDoc(groupDocRef, {
        title: title,
        course: course,
        prerequisites: prerequisites,
        time: time,
        location: location,
        numberOfParticipants: Number(participants),
        participantDetails: [
          { name: user?.fullName, url: user?.imageUrl , email: user?.emailAddresses[0]?.emailAddress},
        ],
        details: details,
      });
      setTitle('');
      setCourse('');
      setPrerequisites('');
      setTime('');
      setLocation('');
      setParticipants('');
      setDetails('');
      handleClose();
      toast('Study group created successfully!', 
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      alert('Error creating study group');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Study Group</h2>
          <button onClick={handleClose} className="text-xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="number"
            placeholder="Number of Participants"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></input>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
