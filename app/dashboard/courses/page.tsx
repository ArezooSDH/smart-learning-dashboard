"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { Column } from "@/app/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CourseForm from "@/app/components/CourseForm";
import { Plus } from "lucide-react"; // برای آیکون مثبت دکمه

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Course = {
  id: number;
  title: string;
  instructor: string;
};

const columns: Column<Course>[] = [
  { header: "ID", accessor: "id", sortable: true },
  { header: "Title", accessor: "title", sortable: true },
  { header: "Instructor", accessor: "instructor", sortable: true },
  { header: "Actions", sortable: false },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // استیت‌های مدیریت دیالوگ‌ها
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (values: { title: string; instructor: string }) => {
  try {
    const res = await axios.post("/api/courses", values);

    if (res.status === 201) {
      await fetchData();
      toast.success("Course added successfully 🎉");
      setIsAddOpen(false);
    }
  } catch (err) {
    toast.error("Failed to add course.");
    console.error(err);
  }
};


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/courses?id=${id}`);
      await fetchData();
      toast.success("Course deleted successfully.");
    } catch (err) {
      toast.error("Could not delete the course.");
      console.error(err);
    }
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
  };

  const handleUpdateCourse = async (values: { title: string; instructor: string }) => {
  if (!editingCourse) return;

  try {
    setEditLoading(true);

    const res = await axios.put(`/api/courses?id=${editingCourse.id}`, values);

    if (res.status === 200) {
      await fetchData();
      toast.success("Course updated successfully ✨");
      setEditingCourse(null);
    }
  } catch (err) {
    toast.error("Failed to update course");
    console.error(err);
  } finally {
    setEditLoading(false);
  }
};


  return (
    <div className="text-cyan-800 w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto mt-10 p-4 flex flex-col space-y-6">
        {/* هدر صفحه: شامل عنوان و دکمه افزودن کاملاً شبیه به صفحه دانشجویان */}
        <div className="flex justify-between items-center w-full pb-4">
          <h2 className="text-3xl font-bold">Courses</h2>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-black hover:bg-slate-800 text-white flex items-center gap-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>

        {/* جدول داده‌ها */}
        <DataTable<Course>
          columns={columns}
          data={courses}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          searchFields={["id", "title", "instructor"]}
          searchPlaceholder="Search courses..."
        />

        {/* دیالوگ ثبت دوره جدید */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the details to register a new course.
              </DialogDescription>
            </DialogHeader>

            <CourseForm onSubmit={handleAddCourse} submitText="Create Course" />
          </DialogContent>
        </Dialog>

        {/* دیالوگ ویرایش دوره */}
        <Dialog
          open={editingCourse !== null}
          onOpenChange={(open) => {
            if (!open) setEditingCourse(null);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update the course details here.
              </DialogDescription>
            </DialogHeader>

            <CourseForm
              defaultValues={
                editingCourse
                  ? {
                      title: editingCourse.title,
                      instructor: editingCourse.instructor,
                    }
                  : undefined
              }
              onSubmit={handleUpdateCourse}
              submitText={editLoading ? "Saving..." : "Save changes"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
