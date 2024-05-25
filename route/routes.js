import express from 'express';
import {registerUser, loginUser, getUser, updateUser} from '../controllers/userController.js'
const router = express.Router();

import Auth from '../middleware/auth.js';


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", Auth, getUser);
router.put("/users/update", Auth, updateUser);



export default router;
