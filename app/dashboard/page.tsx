"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import axios from "axios";

type Student = {
  id: number;
  name: string;
  email: string;
};

type Course = {
  id: number;
  title: string;
  instructor: string;
};

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        axios.get("/api/students"),
        axios.get("/api/courses"),
      ]);

      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const latestStudent = [...students].sort((a, b) => a.id - b.id).at(-1);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      <StatCard
        title="Total Students"
        value={students.length}
        color="text-blue-600"
      />

      <StatCard
        title="Total Courses"
        value={courses.length}
        color="text-green-600"
      />

      <StatCard
        title="Latest Student"
        value={latestStudent ? latestStudent.name : "No Students"}
      />
    </div>
  );
}
