export function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);  // Make sure the parsed object has _id
  } catch {
    return null;
  }
}
