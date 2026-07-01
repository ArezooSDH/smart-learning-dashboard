import { NextResponse } from "next/server";

let courses = [
  { id: 1, title: "Math", instructor: "Fathi" },
  { id: 2, title: "science", instructor: "Moghaddam" },
];

export async function GET() {
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title?.trim() || !body.instructor?.trim()) {
      return NextResponse.json(
        { error: "Title and instructor are required" },
        { status: 400 },
      );
    }

    const newCourse = {
      id: Date.now(),
      title: body.title,
      instructor: body.instructor,
    };
    courses.push(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add course" },
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

    courses = courses.filter((course) => course.id !== id);

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

    if (!body.title?.trim() || !body.instructor?.trim()) {
      return NextResponse.json(
        { error: "Title and instructor are required" },
        { status: 400 }
      );
    }

    const courseIndex = courses.findIndex((course) => course.id === id);

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      title: body.title.trim(),
      instructor: body.instructor.trim(),
    };

    return NextResponse.json(courses[courseIndex]);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}


