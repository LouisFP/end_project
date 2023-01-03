import apiAxios from "./axios";

// API interface for logging a user in
export const login = async (credentials) => {
  try {
    const response = await apiAxios.post("/login", credentials);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for registering a user
export const register = async (data) => {
  try {
    const response = await apiAxios.post("/users/register", data);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
