export const saveUser = (user) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = users.some((u) => u.email === user.email);
  if (emailExists) {
    throw new Error("User with this email already exists.");
  }
  users.push({ ...user, id: Date.now(), lastLogin: new Date().toISOString() });
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUserByEmail = (email) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find((user) => user.email === email);
};

export const setUserSession = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getUserSession = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

export const clearUserSession = () => {
  localStorage.removeItem("currentUser");
};
