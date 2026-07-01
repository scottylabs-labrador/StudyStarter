"use client";

import { useEffect, useState } from "react";
import {
  addUserCourse,
  deleteUserCourse,
  subscribeUserCourses,
} from "../services/profileService";
import type { Course } from "../types";

export function useUserCourses(userId?: string) {
  const [classes, setClasses] = useState<Course[]>([]);

  useEffect(() => {
    if (!userId) return;

    return subscribeUserCourses(userId, setClasses, (error) =>
      console.error("Error getting documents: ", error),
    );
  }, [userId]);

  const addCourse = async (course: Course) => {
    if (!userId) return;
    await addUserCourse(userId, course);
  };

  const deleteCourse = async (courseID: string) => {
    if (!userId) return;
    await deleteUserCourse(userId, courseID);
  };

  return { classes, setClasses, addCourse, deleteCourse };
}
