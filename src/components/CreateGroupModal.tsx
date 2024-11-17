"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { setDoc, doc, getDoc, getDocs, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function CreateGroupModal() {
  const { user } = useUser();
  
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [seats, setSeats] = useState('');
  const [details, setDetails] = useState('');
  const [classes, setClasses] = useState([]); // Define classes state

  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCreateGroupModalOpen);

  const handleClose = () => {
    dispatch(setIsCreateGroupModalOpen(false));
  };

  async function checkId(docRef) {
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 20; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let groupDocRef = doc(db, "Study Groups", id);
    while (await checkId(groupDocRef)) {
      id = '';
      for (let i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      groupDocRef = doc(db, "Study Groups", id);
    }

    await setDoc(groupDocRef, {
      id,
      title,
      course,
      purpose,
      date,
      time,
      location,
      totalSeats: Number(seats),
      participantDetails: [{ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress }],
      details,
    });

    setTitle('');
    setCourse('');
    setPurpose('');
    setDate('');
    setTime('');
    setLocation('');
    setSeats('');
    setDetails('');
    handleClose();

    toast('Study group created successfully!', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    getDocs(classesRef).then(querySnapshot => {
      const classlist = [];
      querySnapshot.forEach(doc => {
        classlist.push(doc.id);
      });
      setClasses(classlist);
    });
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="w-96 rounded-lg dark:bg-white p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Study Group</h2>
          <button onClick={handleClose} className="text-xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="mb-2 w-full rounded border-b-4 border-b-darkAccent dark:bg-white p-2"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={20} // Reasonable character limit
          />
          <select
            className="mb-2 w-full rounded border p-2"
            id="classSelect"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="" disabled>Select a class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            maxLength={30} // Reasonable character limit
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="time"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            className="mb-2 w-full rounded border p-2 dark:bg-darkHighlight"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            className="mb-2 w-full rounded border p-2 dark:bg-darkHighlight" 
            type="number"
            placeholder="Max Seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            min="2" // Minimum participants of 2
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white bg-darkAccent"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
