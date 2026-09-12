import React,{useEffect,useState} from 'react'
import Cards from './components/Cards';


const App = () => {

  const [posts, setposts] = useState([])

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setposts(data)); // most important
  }, [])

  const handleDelete = (id) => {  // most important
    setposts(posts.filter((posts)=>posts.id !== id))
  }
  
  return (
    <div className="">
      <div className="min-h-screen p-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          My Tasks
        </h1>

        <div className="flex flex-wrap justify-center gap-6">
          {
            posts.map((posts) => {
              // most important
              return (
                <Cards
                  key={posts.id}
                  id={posts.id}
                  title={posts.title}
                  description={posts.body}
                  onDelete={handleDelete}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App
