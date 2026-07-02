"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import StatCard from "../components/StatCard";

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [studentsRes, coursesRes] = await Promise.all([
        axios.get("/api/students"),
        axios.get("/api/courses"),
      ]);

      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const latestStudent = [...students].sort((a, b) => a.id - b.id).at(-1);

  if (loading) {
    return (
      <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Students" value="..." color="text-blue-600" />

        <StatCard title="Total Courses" value="..." color="text-green-600" />

        <StatCard
          title="Latest Student"
          value="Loading..."
          color="text-purple-600"
        />
      </div>
    );
  }

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        color="text-purple-600"
      />
    </div>
  );
}
