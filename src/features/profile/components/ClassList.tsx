import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, collection, query, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useUser } from "~/lib/auth-client";
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
  const [classes, setClasses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const classes = querySnapshot.docs.map((classDoc) => ({
      ...(classDoc.data() as Course),
    }));
    setClasses(classes);
  }, (error) => {
    console.error('Error getting documents: ', error);
  });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
      const response = await axios.get<Course[]>(
      "https://course-tools.apis.scottylabs.org/courses/all");
      setCourses(response.data); // Store the entire course list
      setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const updateFilteredCourses = (query: string, selectedClasses: Course[]) => {
    if (query === "") {
      setFilteredCourses([]);
      return;
    }

    if (query.length >= 3 && "0123456789".includes(query.charAt(0)) && "0123456789".includes(query.charAt(1)) && "0123456789".includes(query.charAt(2))) {
      query = query.substring(0,2)+'-'+query.substring(2);
      setSearchQuery(query);
    }

    const selectedCourseIds = selectedClasses.map((course) => course.courseID);
    const filtered = courses
    .filter((course) =>
      (course.name.toLowerCase().includes(query) || 
      course.courseID.toLowerCase().includes(query)) &&
    !(selectedCourseIds.includes(course.courseID))
    )
    .slice(0, 10);

    setFilteredCourses(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    updateFilteredCourses(query, classes);
  };

  const addClass = async (course: Course) => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      if (!userId) {
        return;
      }
      const usersDocRef = doc(db, "Users", userId);
      const classesRef = collection(usersDocRef, "Classes");
      await setDoc(doc(classesRef, course.courseID), course);
      const nextClasses = [...classes, course];
      setClasses(nextClasses);
      updateFilteredCourses(searchQuery, nextClasses);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearchKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredCourses.length > 0) {
      event.preventDefault();
      const firstFilteredCourse = filteredCourses[0];
      if (firstFilteredCourse) {
        await addClass(firstFilteredCourse);
      }
    }
  };

  if (loading) return <p className='text-white'>Loading...</p>;

  return (
    <div className="p-0">
      <h1 className="section-heading">Search Courses</h1>

      {/* Search Bar */}
      <input
        type="search"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleSearchKeyDown}
        className="course-search-input"
        id="searchBar"
      />

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <ul className="text-black dark:text-white list-none pl-0">
          {filteredCourses.map((course) => (
            <li className="flex items-center my-2" key={course.id}>
              <button
                onClick={async () => await addClass(course)}
                className="course-search-result"
              >
                {/* '+' Symbol */}
                <span className="mr-2 text-xl flex-shrink-0">+</span>

                {/* Course Text */}
                <span
                  className="course-search-text"
                  title={`${course.courseID} ${course.name}`} // Adds tooltip for full name
                >
                  {course.courseID} {course.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchQuery && <p className="text-black dark:text-white">No courses found.</p>
      )}
    </div>
    );
  };

export function ClassList() {
  const { user } = useUser();
  const [classes, setClasses] = useState<Course[]>([]);

  const deleteClass = (courseID: string) => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
    const classesRef = collection(usersDocRef, "Classes");
    deleteDoc(doc(classesRef, courseID));
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map((classDoc) => ({
        ...(classDoc.data() as Course),
      }));
      setClasses(classes);
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="mt-8">
      <Courses />
      <br />
      <h2 className="text-l font-bold mb-1 text-black dark:text-white">{(classes == undefined || classes == null || classes.length == 0) ? '' : "My Classes"}</h2>
      <ul className="mt-212 space-y-2">
        {classes.map((cls) => (
          <li
            key={cls.courseID}
            className="class-list-item">
            <div className="class-list-text">
              <strong>{cls.courseID}</strong> - {cls.name}
            </div>
            <button
              onClick={async () => await deleteClass(cls.courseID)}
              className="text-lightgray-500 text-xl"
            >
              <strong>&times;</strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

}
