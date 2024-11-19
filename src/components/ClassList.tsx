import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

interface Course {
  name: string;
  courseID: string;
  id: string
}

const Courses: React.FC = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>(
          "https://course-tool-backend-2kh6wuzobq-uc.a.run.app/courses/all"
        );
        setCourses(response.data); // Store the entire course list
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredCourses([]);
      return;
    }

    // Filter courses and limit to the top 10
    const filtered = courses
      .filter((course) =>
        course.name.toLowerCase().includes(query) || 
        course.courseID.toLowerCase().includes(query)
      )
      .slice(0, 30);

    setFilteredCourses(filtered);
  };

  const addClass = async (course: Course) => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const usersDocRef = doc(db, "Users", userId? userId : "");
      const classesRef = collection(usersDocRef, "Classes");
      await setDoc(doc(classesRef, course.courseID), course);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p className='text-white'>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-white text-xl font-bold mb-4">Search Courses</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <ul className="text-white list-disc pl-6">
          {filteredCourses.map((course) => (
            <li key={course.id}>
              <div className='flex flex-row'>
                <p className="font-medium">{course.courseID}  {course.name}</p>
                <button
                  onClick={async () => await addClass(course)}
                  className="text-white text-xl px-3 py-1 rounded hover:bg-gray-700 focus:outline-none ml-2"
                >+</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        searchQuery && <p className="text-white">No courses found.</p>
      )}
    </div>
  );
};

export function ClassList() {
  const { user } = useUser();
  var [classes, setClasses] = useState<any[]>([]);

  const deleteClass = (cls: any) => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    deleteDoc(doc(classesRef, cls));
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
      setClasses(classes)
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex flex-row justify-between">
      <Courses />
      <div className="flex flex-1 flex-col">
        <h2 className="text-xl font-bold mb-4 text-white">My Classes</h2>
        <ul className="space-y-2">
          {classes.map((cls) => (
            <li
              key={cls.id}
              className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600 text-white"
            >
              <div>
                <strong>{cls.courseID}</strong> {cls.professor}: {cls.name}
              </div>
              <button
                onClick={async () => await deleteClass(cls.courseID)}
                className="text-red-500 text-xl px-3 py-1 rounded hover:bg-gray-700 focus:outline-none"
              >x</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}