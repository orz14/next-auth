import jwt from "jsonwebtoken";
import { getCookie } from "./get-cookie";

export const getUser = () => {
  try {
    const token = getCookie("token");

    const decoded = jwt.decode(token);
    return decoded.data;
  } catch (err) {
    console.log("🚀 ~ getUser ~ err:", err);
    return null;
  }
};
