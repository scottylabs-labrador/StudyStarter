import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useUser } from "~/lib/auth-client";
import { getAllCourses } from "../services/profileService";
import { useUserCourses } from "../hooks/useUserCourses";
import type { Course } from "../types";
import { Plus, Search, X } from "lucide-react";

type CoursesProps = {
  userId?: string;
  classes: Course[];
  setClasses: Dispatch<SetStateAction<Course[]>>;
  addCourse: (course: Course) => Promise<void>;
};

function Courses({ userId, classes, setClasses, addCourse }: CoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCourses();
        setCourses(courses);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    void fetchCourses();
  }, []);

  const updateFilteredCourses = (query: string, selectedClasses: Course[]) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setFilteredCourses([]);
      return;
    }

    let searchValue = normalizedQuery;
    if (
      searchValue.length >= 3 &&
      "0123456789".includes(searchValue.charAt(0)) &&
      "0123456789".includes(searchValue.charAt(1)) &&
      "0123456789".includes(searchValue.charAt(2))
    ) {
      searchValue = `${searchValue.substring(0, 2)}-${searchValue.substring(2)}`;
      setSearchQuery(searchValue);
    }

    const selectedCourseIds = selectedClasses.map((course) => course.courseID);
    const filtered = courses
      .filter(
        (course) =>
          (course.name.toLowerCase().includes(searchValue) ||
            course.courseID.toLowerCase().includes(searchValue)) &&
          !selectedCourseIds.includes(course.courseID),
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
    try {
      if (!userId) {
        return;
      }
      await addCourse(course);
      const nextClasses = [...classes, course];
      setClasses(nextClasses);
      updateFilteredCourses(searchQuery, nextClasses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && filteredCourses.length > 0) {
      event.preventDefault();
      const firstFilteredCourse = filteredCourses[0];
      if (firstFilteredCourse) {
        await addClass(firstFilteredCourse);
      }
    }
  };

  if (loading) return <p className="course-loading">Loading courses…</p>;

  return (
    <div className="course-search-section">
      <label htmlFor="searchBar">Search by course number or title</label>
      <div className="course-search-box"><Search size={15} /><input type="search" placeholder="15-213" value={searchQuery} onChange={handleSearch} onKeyDown={handleSearchKeyDown} className="course-search-input" id="searchBar" />{searchQuery && <button type="button" onClick={() => { setSearchQuery(""); setFilteredCourses([]); }} aria-label="Clear course search"><X size={15} /></button>}</div>

      {filteredCourses.length > 0 ? (
        <ul className="course-result-list">
          {filteredCourses.map((course) => (
            <li key={course.id}>
              <button
                onClick={async () => await addClass(course)}
                className="course-search-result"
              >
                <span className="course-search-text" title={`${course.courseID} ${course.name}`}><strong>{course.courseID}</strong><small>{course.name}</small></span><Plus size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchQuery && (
          <p className="course-empty">No courses found.</p>
        )
      )}
    </div>
  );
}

export function ClassList() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const { classes, setClasses, addCourse, deleteCourse } =
    useUserCourses(userId);

  return (
    <div className="class-list">
      <Courses
        userId={userId}
        classes={classes}
        setClasses={setClasses}
        addCourse={addCourse}
      />
      <h2>{classes.length === 0 ? "" : "My Classes"}</h2>
      <ul>
        {classes.map((cls) => (
          <li key={cls.courseID} className="class-list-item">
            <div className="class-list-text">
              <strong>{cls.courseID}</strong> - {cls.name}
            </div>
            <button onClick={async () => await deleteCourse(cls.courseID)} aria-label={`Remove ${cls.courseID}`}><X size={15} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
