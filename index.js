const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');

const app = express();

// ✅ Fix CORS to allow only frontend deployment
app.use(cors({
    origin: "https://client-deploy-7i9goie91-dimal-thomas-projects.vercel.app", // Change this to match your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://root:12345@cluster-1.wf9i7.mongodb.net/deploy?retryWrites=true&w=majority&appName=Cluster-1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log("Error connecting to MongoDB:", err));

// ✅ GET all users
app.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET a single user by ID
app.get('/getUser/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE user by ID
app.put('/updateUser/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            },
            { new: true } // Returns updated user
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE user by ID
app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ CREATE a new user
app.post('/createUser', async (req, res) => {
    try {
        const newUser = await UserModel.create(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
