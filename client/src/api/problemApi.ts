import axios from "axios";

const BASE_URL = "http://localhost:5000/problems";

export const getProblem = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};
