import axios from "axios";

export type StudentPayload = {
  name: string;
  email: string;
};

export const getStudents = async () => {
  const response = await axios.get("/api/students");
  return response.data;
};

export const createStudent = async (
  data: StudentPayload,
) => {
  const response = await axios.post("/api/students", data);
  return response.data;
};

export const updateStudent = async (
  id: number,
  data: StudentPayload,
) => {
  const response = await axios.put(
    `/api/students?id=${id}`,
    data,
  );

  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await axios.delete(
    `/api/students?id=${id}`,
  );

  return response.data;
};
