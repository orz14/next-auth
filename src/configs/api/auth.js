import { getCookie } from "@/lib/get-cookie";
import axios from "axios";

const HOST = process.env.NEXT_PUBLIC_API_URL;

const auth = {
  login: (credentials) => axios.post(`${HOST}/auth/login`, credentials),
  register: (credentials) => axios.post(`${HOST}/auth/register`, credentials),
  getUser: () =>
    axios.get(`${HOST}/auth/me`, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }),
  logout: () =>
    axios.post(`${HOST}/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }),
};

export default auth;
