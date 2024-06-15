import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser} from '../controllers/userController.js'
import {uploadVideo, getVideosMetadata, deleteVideo, getUserVideosMetadata} from '../controllers/assetController.js';
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
router.post("/users/logout", logoutUser);

//Asset routes
router.post("/videos/upload", Auth, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), uploadVideo);
router.get("/videos/metadata", getVideosMetadata);
router.get("/videos/user", Auth, getUserVideosMetadata);
router.post("/videos/delete", deleteVideo);

export default router;
