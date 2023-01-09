import React from "react";
import { loginUser, selectCurrentUser } from "../../features/users/usersSlice";

// React Hook Form Validation
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit(onSubmit)} />
      <input
        type="text"
        name="username"
        required={true}
        placeholder="Username"
        {...register("Username")}
      />
      <input type="submit" />
    </div>
  );
}

export default Login;
