import React from "react";
import { loginUser, selectCurrentUser } from "../../features/users/usersSlice";

// React Hook Form Validation
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function Login() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const loginAttempt = await dispatch(
      loginUser({
        username: data.username,
        password: data.password,
      })
    );
  };

  return (
    <div className="loginForm">
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
