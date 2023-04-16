import decodeToken from "jwt-decode";
function saveToken(token) {
  localStorage.setItem("x-auth", token);
  document.cookie = `x-auth=${token};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}
function getCurrentUser() {
  const token = localStorage.getItem("x-auth");
  if (!token) return;
  const user = decodeToken(token);
  return user;
}
export { saveToken , getCurrentUser };
