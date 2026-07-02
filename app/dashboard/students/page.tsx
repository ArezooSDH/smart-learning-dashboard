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
} from "@/components/ui/dialog";
import StudentForm, { StudentFormValues } from "@/app/components/StudentForm";
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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/students");
      setStudents(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (values: StudentFormValues) => {
    try {
      await axios.post("/api/students", values);
      toast.success("Student added successfully 🎉");
      setIsAddDialogOpen(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add student");
    }
  };

  const handleUpdateStudent = async (values: StudentFormValues) => {
    if (!editingStudent) return;

    try {
      await axios.put(`/api/students?id=${editingStudent.id}`, values);
      toast.success("Student updated successfully ✨");
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update student");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/students?id=${id}`);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete the student");
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-cyan-800">
      <div className="w-full max-w-4xl mx-auto mt-10 p-4 flex flex-col gap-6">
        
        {/* header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Student
          </Button>
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

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-[95vw] sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter student information below.
              </DialogDescription>
            </DialogHeader>

            <StudentForm
              onSubmit={handleAddStudent}
              submitText="Create Student"
            />
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={editingStudent !== null}
          onOpenChange={(open) => {
            if (!open) setEditingStudent(null);
          }}
        >
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update the student information.
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
