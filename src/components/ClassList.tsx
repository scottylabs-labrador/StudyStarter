import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

interface Course {
  name: string;
  courseID: string;
  id: string;
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
    "https://course-tools.apis.scottylabs.org/courses/all"
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
  var query = event.target.value.toLowerCase();
  setSearchQuery(query);
  
  if (query === "") {
    setFilteredCourses([]);
    return;
  }
  
  if (query.length >= 3 && "0123456789".includes(query.charAt(0)) && "0123456789".includes(query.charAt(1)) && "0123456789".includes(query.charAt(2))) {
  query = query.substring(0,2)+'-'+query.substring(2);
 // document.getElementById("searchBar").value = query;
  setSearchQuery(query);
  }
  
  // Filter courses and limit to the top 10
  const filtered = courses
  .filter((course) =>
  course.name.toLowerCase().includes(query) || 
  course.courseID.toLowerCase().includes(query)
  )
 .slice(0, 10);
  
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
        <div className="p-0">
          <h1 className="dark:text-white text-black text-xl font-bold mb-2">Search Courses</h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="text-black border border-gray-300 rounded p-2 w-full mb-0"
            id="searchBar"
          />

          {/* Course List */}
          {filteredCourses.length > 0 ? (
            <ul className="dark:text-white text-black list-none pl-0">
              {filteredCourses.map((course) => (
                <li className="flex items-center my-2" key={course.id}>
                  <button
                    onClick={async () => await addClass(course)}
                    className="dark:text-white text-black text-l px-2 py-1 rounded hover:bg-gray-700 focus:outline-none flex items-center w-full"
                  >
                    {/* '+' Symbol */}
                    <span className="mr-2 text-xl flex-shrink-0">+</span>

                    {/* Course Text */}
                    <span
                      className="font-medium text-left"
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        display: 'block', // Ensures block behavior inside flex
                        flexGrow: 1, // Allows the text to use remaining space
                      }}
                      title={`${course.courseID} ${course.name}`} // Adds tooltip for full name
                    >
                      {course.courseID} {course.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery && <p className="dark:text-white text-black">No courses found.</p>
          )}
        </div>



    );
  };


// interface Class {
//   title: string;
//   professor: string;
//   section: string;
// }

export function ClassList() {
  const { user } = useUser();
  var [classes, setClasses] = useState<any[]>([]);
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
      <div className="mt-8">
        <Courses />
        <br></br>
        <h2 className="text-xl font-bold mb-0 text-black dark:text-white mb-2">My Classes</h2>
        <ul className="mt-212 space-y-2">
          {classes.map((cls) => (
            <li
              key={cls.id}
              className="text-black dark:text-white dark:bg-darkSidebar bg-lightSidebar p-2 rounded w-full flex justify-between items-center"
            >
              <div className="truncate" style={{ maxWidth: "calc(100% - 2rem)" }}>
                <strong>{cls.courseID}</strong> - {cls.name}
              </div>
              <button
                onClick={async () => await deleteClass(cls.title)}
                className="text-lightgray-500 text-xl"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

    
  );

}