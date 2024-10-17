export default function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Bad request" });
  }

  res.setHeader("Set-Cookie", "token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
  res.status(200).json({ message: "Logged out" });
}
