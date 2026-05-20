function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      // return res.send("<div style='text-align:center;text-shadow:4px 4px 4px white;color:red'>Access Denied</div>");
      return res.redirect("/login");
    }
    next();
  };
}
export default roleMiddleware;