import apiAxios from "./axios";

// API interface for loading the user's profile
export const fetchUser = async () => {
  try {
    const response = await apiAxios.get(`/users`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for updating the user's profile
export const updateUser = async () => {
  try {
    const response = await apiAxios.put(`/users`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
