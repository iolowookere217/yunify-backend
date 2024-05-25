import express from 'express';
import {registerUser, loginUser, logoutUser} from '../controllers/userController.js'
const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/logout", loginUser);


export default router;
