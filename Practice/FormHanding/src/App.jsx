import React from 'react'
import {useForm} from "react-hook-form"

const App = () => {

  const { register, handleSubmit } = useForm()
  
  const onsubmit = (data) => {
    console.log(data)
  }

  return (
    <div className="page">
      <div className="form-card">
        <div className="form-header">
          <h1>Create Account</h1>
          <p>Register your account to get started</p>
        </div>

        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("username")}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default App
