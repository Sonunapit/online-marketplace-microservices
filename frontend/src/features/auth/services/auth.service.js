import {
  authAPI,
} from "../../../api/axios";

// Register
export const registerUser =
  async (data) => {

    return authAPI.post(
      "/auth/register",
      data
    );

};

// Login
export const loginUser =
  async (data) => {

    return authAPI.post(
      "/auth/login",
      data
    );

};

// Current User
export const getCurrentUser =
  async (token) => {

    return authAPI.get(
      "/auth/me",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

};