import React from 'react'

const App = () => {

  return (
    <div className="page">
      <div className="form-card">
        <div className="form-header">
          <h1>Create Account</h1>
          <p>Register your account to get started</p>
        </div>

        <form>
          <div className="input-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default App
