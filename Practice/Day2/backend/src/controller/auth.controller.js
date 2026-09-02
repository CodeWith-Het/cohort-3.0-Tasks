const users = []

const registerUser = (req,res) => {
    const { username, email, password } = req.body
    
    const user = {
        id: users.length + 1,
        username,
        email,
        password
    }

    users.push(user)

    res.status(201).json({
        message: "usere done",
        user
    })
}

const loginUser = (req,res) => {
    const { username, password } = req.body

    const user = users.find((user) => user.username === username)
    
    if (!user) {
        return res.status(401).json({
            message:"invaild user"
        })
    }

    if (user.password !== password) {
        return res.status(401).json({
            message:"invaild password"
        })
    }

    res.status(200).json({
        message: {
            messagwe: "login user",
            user
        }
    })
}
export default {registerUser,loginUser}