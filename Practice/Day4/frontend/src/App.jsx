import { useForm } from "react-hook-form";
import axios from "axios";

const App = () => {
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = async (data) => {
    for (const image of data.images) {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("images", image);

      axios.post("http://localhost:3000/file/", formData, {
        withCredentials: true
     })

      console.log("Response:", data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <input type="text" placeholder="Enter name" {...register("name")} />

      <input type="email" placeholder="Enter email" {...register("email")} />

      <input type="file" accept="image/*" multiple {...register("images")} />

      <button type="submit">Upload</button>
    </form>
  );
};

export default App;