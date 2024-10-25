import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, collection, query, onSnapshot } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';


interface Class {
  title: string;
  professor: string;
  section: string;
}

export function ClassList() {
  const { user } = useUser();
  const [classes, setClasses] = useState<any[]>([]);
  const [newClass, setNewClass] = useState({ title: '', professor: '', section: '' });

  const addClass = () => {
    if (newClass.title && newClass.professor && newClass.section) {

      setNewClass({ title: '', professor: '', section: '' });
      
      const userId = user?.emailAddresses[0]?.emailAddress;
      const usersDocRef = doc(db, "Users", userId? userId : "");
      const classesRef = collection(usersDocRef, "Classes");
      setDoc(doc(classesRef, newClass.title), {
        title: newClass.title,
        professor: newClass.professor,
        section: newClass.section,
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setClasses(classes);
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">My Classes</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Course Title"
          value={newClass.title}
          onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Professor"
          value={newClass.professor}
          onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Section"
          value={newClass.section}
          onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={addClass}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Class
        </button>
      </div>
      <ul className="space-y-2">
        {classes.map((cls) => (
          <li key={cls.id} className="bg-gray-100 p-2 rounded">
            <strong>{cls.title}</strong> - Prof. {cls.professor}, Section: {cls.section}
          </li>
        ))}
      </ul>
    </div>
  );
}