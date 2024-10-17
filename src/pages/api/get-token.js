export default function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Bad request" });
  }

  res.status(200).json({ token });
}
