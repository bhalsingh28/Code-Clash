import axios from "axios";
console.log(import.meta.env.VITE_BACKEND_URL);
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/problems`;

export const getProblem = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};
