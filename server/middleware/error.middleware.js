export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error("[ERROR]", err.message);
  res.status(status).json({ success: false, message: err.message || "Server error" });
}
