import express from 'express';
import {registerUser} from '../controllers/userController.js'
const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);


export default router;
