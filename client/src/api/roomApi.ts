import axios from "axios";

const BASE_URL = "http://localhost:5000/rooms";

export const getRooms = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createRoom = async (name: string) => {
  const res = await axios.post(BASE_URL, { name });
  return res.data;
};

export const joinRoom = async (id: string, user: string) => {
  const res = await axios.put(`${BASE_URL}/${id}/join`, { user });
  return res.data;
};
