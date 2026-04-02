import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getRooms = async () => {
  const res = await axios.get(`${BASE_URL}/rooms`);
  return res.data;
};

export const createRoom = async (
  name: string,
  difficulty: string,
  timerMinutes: number,
) => {
  const res = await axios.post(`${BASE_URL}/rooms`, {
    name,
    difficulty,
    timerMinutes,
  });
  return res.data;
};

export const joinRoom = async (id: string, user: string) => {
  const res = await axios.put(`${BASE_URL}/rooms/${id}/join`, { user });
  return res.data;
};

export const startGame = async (roomId: string) => {
  const res = await axios.post(`${BASE_URL}/game/start`, { roomId });
  return res.data;
};

export const submitCode = async (
  roomId: string,
  userId: string,
  code: string,
) => {
  const res = await axios.post(`${BASE_URL}/game/submit`, {
    roomId,
    userId,
    code,
  });
  return res.data;
};

export const getGameStatus = async (roomId: string) => {
  const res = await axios.get(`${BASE_URL}/game/${roomId}/status`);
  return res.data;
};

export const getRandomProblem = async (difficulty?: string) => {
  const params = difficulty ? `?difficulty=${difficulty}` : "";
  const res = await axios.get(`${BASE_URL}/game/problem/random${params}`);
  return res.data;
};
