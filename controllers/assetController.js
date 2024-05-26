import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../firestore.js";
import { collection, addDoc } from "firebase/firestore";
import db from "../firestore.js";
import { v4 as uuidv4 } from 'uuid';

// generate date  for unique filenames
import { format } from 'date-fns';

const now = new Date();
const yearMonthDay = format(now, 'yyyyMMdd');



// Generate a random string for uniqueness within filenames
function generateRandomString() {
    return Math.random().toString(36).slice(2, 8); // Generate and slice a random string
  }


// upload a video/
export async function uploadVideoA(req, res){
    try {
        const {userId} = req.user;

        // check if a file is uploaded
        const uploadedVideo = req.files?.video; 
        const uploadedThumbnail = req.files?.thumbnail; 

        if (!uploadedVideo) {
            return res.status(400).send({ error: 'No video file uploaded' });
          }
      
        if (!uploadedThumbnail) {
            return res.status(400).send({ error: 'No thumbnail file uploaded' });
          }

        // Generate a unique filename with combined date and random string
        const uniqueFilename = `${yearMonthDay}-${generateRandomString()}`;

        
        // Upload video to  'videos folder'
        const storageRef = ref(storage, 'videos/' + uploadedVideo[0].originalname);
        const uploadVideoTask = uploadBytesResumable(storageRef, uploadedVideo[0].buffer);
        
        // Observe state changes (progress, pause, resume)
        await uploadVideoTask.on('state_changed',
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Video uploading ... ' + Math.floor(progress) + '% done');
            },
            (error) => {
                return res.status(401).send({ error: "Video uploading failed" });
            // Handle errors based on error codes
            }
        );

        // Get download URL after successful upload
        const videodownloadURL = await getDownloadURL(uploadVideoTask.snapshot.ref);

        /* THUMBNAIL */
        // Upload thumbnail to  'thumbnail folder'
        const thumbnailStorageRef = ref(storage, 'thumbnails/' + uploadedThumbnail[0].originalname);
        const uploadthumbnailTask = uploadBytesResumable(thumbnailStorageRef, uploadedThumbnail[0].buffer);

        // Observe state changes (progress, pause, resume)
        await uploadthumbnailTask.on('state_changed',
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Thumbnail uploading ... ' + Math.floor(progress) + '% done');
            },
            (error) => {
                return res.status(401).send({ error: "Thumbnail uploading failed" });
            // Handle errors based on error codes
            }
        );

        // Get download URL after successful upload
        const thumbnaildownloadURL = await getDownloadURL(uploadthumbnailTask.snapshot.ref);

        
        // Create video metadata object with combined data
        const videoData = {
            title : req.body.title, 
            course: req.body.course,
            subject: req.body.subject, 
            description: req.body.description, 
            creator : req.body.creator,
            videoPath: videodownloadURL,
            thumbnailPath: thumbnaildownloadURL,
            creator: userId, 
            uploadDate: new Date(), 
        }; 
        
        
        // **Add video metadata to Firestore**
        const videoRef = collection(db, 'videos_metadata');
        await addDoc(videoRef, videoData); 

    return res.status(200).send({ msg: "Video uploaded successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Video upload failed" });
    }

}

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
      const videoStorageRef = ref(storage, 'videos/' + uploadedVideo[0].originalname);
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
      const thumbnailStorageRef = ref(storage, 'thumbnails/' + uploadedThumbnail[0].originalname);
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
        videoPath: videodownloadURL,
        thumbnailPath: thumbnaildownloadURL,
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