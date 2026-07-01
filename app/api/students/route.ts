import { NextResponse } from "next/server";

type Student = {
  id: number;
  name: string;
  email: string;
};

let students: Student[] = [
  { id: 1, name: "Ali", email: "ali@example.com" },
  { id: 2, name: "Sara", email: "sara@example.com" },
  { id: 3, name: "Mina", email: "mina@example.com" },
  { id: 4, name: "Omid", email: "omid@example.com" },
  { id: 5, name: "Fateme", email: "fateme@example.com" },
  { id: 6, name: "Amir", email: "amir@example.com" },
  { id: 7, name: "Arezoo", email: "arezoo@example.com" },
  { id: 8, name: "Malihe", email: "malihe@example.com" },
  { id: 9, name: "Farzane", email: "farzane@example.com" },
  { id: 10, name: "Afsane", email: "afsane@example.com" },
  { id: 11, name: "Arsha", email: "arsha@example.com" },
  { id: 12, name: "Ilia", email: "ilia@example.com" },
  { id: 13, name: "Aria", email: "aria@example.com" },
  { id: 14, name: "Farzin", email: "farzin@example.com" },
  { id: 15, name: "Shahrzad", email: "shahrzad@example.com" },
  { id: 16, name: "Reza", email: "reza@example.com" },
];

export async function GET() {
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newStudent: Student = {
      id: Date.now(),
      name,
      email,
    };

    students.push(newStudent);

    return NextResponse.json(newStudent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const exists = students.some((student) => student.id === id);

    if (!exists) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    students = students.filter((student) => student.id !== id);

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const studentIndex = students.findIndex(
      (student) => student.id === id
    );

    if (studentIndex === -1) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    students[studentIndex] = {
      ...students[studentIndex],
      name,
      email,
    };

    return NextResponse.json(students[studentIndex]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}
