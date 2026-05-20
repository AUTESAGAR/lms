import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  const token = req.cookies.token; // get token from cookie

  if (!token) return res.redirect("/login");

  try {
    const verified = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

export default authMiddleware;