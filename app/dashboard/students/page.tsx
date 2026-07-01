"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DataTable, { Column } from "@/app/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentForm from "@/app/components/StudentForm";
import { Plus } from "lucide-react";

type Student = {
  id: number;
  name: string;
  email: string;
};

const columns: Column<Student>[] = [
  { header: "ID", accessor: "id", sortable: true },
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
  { header: "Actions", sortable: false },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  // عملیات افزودن دانشجو
  const handleAddStudent = async (values: { name: string; email: string }) => {
  try {
    const res = await axios.post("/api/students", values);

    if (res.status === 201) {
      await fetchData();
      toast.success("Student added successfully 🎉");
      setIsAddDialogOpen(false);
    }
  } catch (err) {
    toast.error("Failed to add student.");
    console.error(err);
  }
};


  // عملیات ویرایش دانشجو
  const handleUpdateStudent = async (values: { name: string; email: string }) => {
  if (!editingStudent) return;

  try {
    const res = await axios.put(`/api/students?id=${editingStudent.id}`, values);

    if (res.status === 200) {
      await fetchData();
      toast.success("Student updated successfully ✨");
      setEditingStudent(null);
    }
  } catch (err) {
    toast.error("Failed to update student.");
    console.error(err);
  }
};


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/students?id=${id}`);
      await fetchData();
      toast.success("Student deleted successfully.");
    } catch (err) {
      toast.error("Could not delete the student.");
      console.error(err);
    }
  };

  return (
    <div className="text-cyan-800 w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto mt-10 p-4 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>

          {/* مدال افزودن دانشجو */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-black hover:bg-slate-800 text-white flex items-center gap-2 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Add Student
            </Button>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student details here.
                </DialogDescription>
              </DialogHeader>

              <StudentForm
                onSubmit={handleAddStudent}
                submitText="Create Student"
              />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable<Student>
          columns={columns}
          data={students}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(student) => setEditingStudent(student)}
          searchFields={["id", "name", "email"]}
          searchPlaceholder="Search students..."
        />

        {/* مدال ویرایش دانشجو */}
        <Dialog
          open={editingStudent !== null}
          onOpenChange={(open) => {
            if (!open) setEditingStudent(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Make changes to the student's profile here.
              </DialogDescription>
            </DialogHeader>

            {editingStudent && (
              <StudentForm
                defaultValues={{
                  name: editingStudent.name,
                  email: editingStudent.email,
                }}
                onSubmit={handleUpdateStudent}
                submitText="Save Changes"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
