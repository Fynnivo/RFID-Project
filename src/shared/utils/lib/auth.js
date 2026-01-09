export default function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    // exp dalam detik, Date.now() dalam ms
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}