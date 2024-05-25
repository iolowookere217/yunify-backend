import express from 'express';
import {registerUser, loginUser, getUser} from '../controllers/userController.js'
const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", getUser);


export default router;
