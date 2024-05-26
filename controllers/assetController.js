import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../firestore.js";
import { collection, addDoc } from "firebase/firestore";
import db from "../firestore.js";


// upload a video
export async function uploadVideo(req, res){
    try {
        const {userId} = req.user;

        // check if a file is uploaded
        const uploadedFile = req.file; // Contains information about the uploaded file
        if (!uploadedFile) {
        return res.status(400).send({ error: 'No file uploaded' });
        }
        
        // Upload file and metadata to the object 'videos folder'
        const storageRef = ref(storage, 'videos/' + uploadedFile.originalname);
        const uploadTask = uploadBytesResumable(storageRef, uploadedFile.buffer);

        // Observe state changes (progress, pause, resume)
        await uploadTask.on('state_changed',
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + Math.floor(progress) + '% done');
            },
            (error) => {
            console.error('Upload error:', error);
            // Handle errors based on error codes (see comments in original code)
            }
        );

        // Get download URL after successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Create video metadata object with combined data
        const videoData = {
            title : req.body.title, 
            course: req.body.course,
            subject: req.body.subject, 
            description: req.body.description, 
            creator : req.body.creator,
            storagePath: downloadURL,
            creator: userId, 
            uploadDate: new Date(), 
        }; 

        
        // **Add video metadata to Firestore**
        const videoRef = collection(db, 'videos_metadata');
        await addDoc(videoRef, videoData); 

        
    return res.status(200).send({ msg: "Video uploaded successfully", downloadURL});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Video upload failed" });
    }

}