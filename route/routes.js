import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser} from '../controllers/userController.js'
import {uploadVideo} from '../controllers/assetController.js';
import Auth from '../middleware/auth.js';

const router = express.Router();

// handles files upload
const upload = multer({storage: multer.memoryStorage()});

router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", Auth, getUser);
router.put("/users/update", Auth, updateUser);
router.post("/videos/upload", Auth, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), uploadVideo);


export default router;
