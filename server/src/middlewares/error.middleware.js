export function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || "Внутренняя ошибка сервера";

  console.error(error);
  res.status(status).json({ error: message });
}
