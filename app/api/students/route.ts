import { NextResponse } from "next/server";

let students = [
  { id: 1, name: "Ali", email: "ali@example.com" },
  { id: 2, name: "Sara", email: "sara@example.com" },
  { id: 3, name: "Mina", email: "Mina@example.com" },
  { id: 4, name: "Omid", email: "Omid@example.com" },
  { id: 5, name: "Fateme", email: "Fateme@example.com" },
  { id: 6, name: "Amir", email: "Amir@example.com" },
  { id: 7, name: "Arezoo", email: "Arezoo@example.com" },
  { id: 8, name: "Malihe", email: "Malihe@example.com" },
  { id: 9, name: "Farzane", email: "Farzane@example.com" },
  { id: 10, name: "Afsane", email: "Afsane@example.com" },
  { id: 11, name: "Arsha", email: "Arsha@example.com" },
  { id: 12, name: "Ilia", email: "Ilia@example.com" },
  { id: 13, name: "Aria", email: "Aria@example.com" },
  { id: 14, name: "Farzin", email: "Farzin@example.com" },
  { id: 15, name: "Shahrzad", email: "Shahrzad@example.com" },
  { id: 16, name: "Reza", email: "Reza@example.com" },
];

export async function GET() {
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const newStudent = {
      id: Date.now(),
      name: body.name.trim(),
      email: body.email.trim(),
    };

    students.push(newStudent);

    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 },
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

    students = students.filter((student) => student.id !== id);

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }
    const studentIndex = students.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    students[studentIndex] = {
      ...students[studentIndex],
      name: body.name.trim(),
      email: body.email.trim(),
    };
    return NextResponse.json(students[studentIndex]);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 },
    );
  }
}
