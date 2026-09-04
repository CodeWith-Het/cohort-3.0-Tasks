const App = () => {
    return (
      
        
    <form>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="profile">Profile Picture</label>
        <input type="file" id="profile" name="profile" accept="image/*" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;