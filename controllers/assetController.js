import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../firestore.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import db from "../firestore.js";

// generate date  for unique filenames
import { format } from 'date-fns';

const now = new Date();
const yearMonthDay = format(now, 'yyyyMMdd');



// Generate a random string for uniqueness within filenames
function generateRandomString() {
    return Math.random().toString(36).slice(2, 8); // Generate and slice a random string
  }

// upload a video
export async function uploadVideo(req, res) {
    try {
      const { userId } = req.user;
  
      // Check if files are uploaded
      const uploadedVideo = req.files?.video;
      const uploadedThumbnail = req.files?.thumbnail;
  
      if (!uploadedVideo) {
        return res.status(400).send({ error: 'No video file uploaded' });
      }
  
      if (!uploadedThumbnail) {
        return res.status(400).send({ error: 'No thumbnail file uploaded' });
      }
  
      // Generate unique filename
      const uniqueFilename = `${yearMonthDay}-${generateRandomString()}`;
  
      // **Video Upload**
  
      // Upload video
      const videoPath = 'videos/' + uploadedVideo[0].originalname;
      const videoStorageRef = ref(storage, videoPath);
      const uploadVideoTask = uploadBytesResumable(videoStorageRef, uploadedVideo[0].buffer);
  
      // Handle progress and errors during video upload
      uploadVideoTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Video uploading ... ' + Math.floor(progress) + '% done');
        },
        (error) => {
          console.error('Error uploading video:', error);
          return res.status(500).send({ error: "Video upload failed" });
        }
      );
  
      // Await the completion of video upload before proceeding
      await uploadVideoTask;
  
      // Get video download URL after successful upload
      const videodownloadURL = await getDownloadURL(uploadVideoTask.snapshot.ref);
  
      // **Thumbnail Upload**
  
      // Upload thumbnail
      const thumbnailPath = 'thumbnails/' + uploadedThumbnail[0].originalname
      const thumbnailStorageRef = ref(storage, thumbnailPath);
      const uploadthumbnailTask = uploadBytesResumable(thumbnailStorageRef, uploadedThumbnail[0].buffer);
  
      // Handle progress and errors during thumbnail upload
      uploadthumbnailTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Thumbnail uploading ... ' + Math.floor(progress) + '% done');
        },
        (error) => {
          console.error('Error uploading thumbnail:', error);
          return res.status(500).send({ error: "Thumbnail uploading failed" });
        }
      );
  
      // Await the completion of thumbnail upload as well
      await uploadthumbnailTask;
  
      // Get thumbnail download URL after successful upload
      const thumbnaildownloadURL = await getDownloadURL(uploadthumbnailTask.snapshot.ref);
  
      // **Video Metadata and Firestore**
  
      // Create video metadata object
      const videoData = {
        title: req.body.title,
        course: req.body.course,
        subject: req.body.subject,
        description: req.body.description,
        creator: req.body.creator,
        videoPath: videoPath,
        thumbnailPath: thumbnailPath,
        videoURL: videodownloadURL,
        thumbnailURL: thumbnaildownloadURL,
        creator: userId,
        uploadDate: new Date(),
      };
  
      // Add video metadata to Firestore
      const videoRef = collection(db, 'videos_metadata');
      await addDoc(videoRef, videoData);
  
      return res.status(200).send({ msg: "Video uploaded successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Video upload failed" });
    }
  }

// Retrieve all video metadata
export async function getVideosMetadata(req, res){
    try {


      const querySnapshot = await getDocs(collection(db, "videos_metadata"));

      // Extract data and IDs in a single step using destructuring and map
      const videoData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      res.status(200).send({
        count: videoData.length,
        data: videoData,
      });
      
    } catch (error) {
      res.status(500).send({error:"Videos retireval failed"});
    }
}

// Delete a video 