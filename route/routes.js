import express from 'express';
import {registerUser, loginUser} from '../controllers/userController.js'
const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);


export default router;
