export default function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  const realIp = Array.isArray(ip) ? ip[0] : ip;

  res.status(200).json({ ip: realIp });
}
