import React from "react";
import {
  loginUser,
  needsLoginRedirectUpdated,
  selectCurrentUser,
  selectNeedsLoginRedirect,
} from "../../features/users/usersSlice";

// React Hook Form Validation
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Login() {
  const dispatch = useDispatch();
  const needsLoginRedirect = useSelector(selectNeedsLoginRedirect);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    await dispatch(
      loginUser({
        username: data.username,
        password: data.password,
      })
    );
    // If come from a part of the site which requires login
    // and not logged in then this will send back after logging in
    if (needsLoginRedirectUpdated) {
      await dispatch(needsLoginRedirectUpdated(false));
      navigate(-1);
    }
  };

  return (
    <div className="loginForm">
      {needsLoginRedirect && (
        <p className="login-redirect">Please Sign in before continuing</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          {...register("username", {
            required: true,
          })}
        />
        <label>Password</label>
        <input
          type="text"
          name="password"
          placeholder="Password"
          {...register("password", {
            required: true,
          })}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Login;
