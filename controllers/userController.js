import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where  } from "firebase/firestore";
import db from "../firestore.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';


import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
const auth = getAuth();




// Register user
export async function  registerUser(req, res){
    try {
        const { password, ...userData} = req.body;

        //check if user email exists
        const q = query(collection(db, "users"), where("email", "==", userData.email));     
        const userSnapshot = await getDocs(q);
        if(!userSnapshot.empty){
            return res.status(400).send({ msg: "Email already exists"});
        }

        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "users", user.uid), userData);


        //user id
        console.log('User signed up successfully:', user.uid);

        // send verification email
        await sendEmailVerification(user);
       
        return res.status(200).send({ msg: "User registered successfully, Check email for verification code"});
        
        
    } catch (error) {
        return res.status(500).send({ error: "User not created" });
    }
};

// User login
export async function loginUser(req, res){

    try {
        const {email, password} = req.body;
    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a JWT token
        const token = jwt.sign(
            {
                userId: user.uid,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.status(200).send({ msg: "User logged in successfully", accessToken: token, fullname: user.displayName});
        
        
    } catch (error) {
        return res.status(500).send({ error: "Login failed" });
    }

};

// Get user profile
export async function getUser(req, res){
    try {
        // Get user data and id

        const {userId} = req.user;
        const userRef = doc(db, "users", userId);

        const userSnap = await getDoc(userRef);

        // User exists
        if (userSnap.exists()) {
            return res.status(200).send(userSnap.data());
        } else {
            return res.status(404).send({ error: "User not found" });
        }
        
        
    } catch (error) {
        return res.status(500).send({ error: "Retrieving user details failed" });
    }  
}

// Update user profile
export async function updateUser(req, res){
    try {
        

        // Get user data and id 
        const userData = req.body;
        const {userId} = req.user;
        
        const userRef = doc(db, "users", userId);

        // update displayName 
        if (userData.hasOwnProperty('name')) {
            const user = auth.currentUser;
            await updateProfile(user, { displayName: userData.name });
          } 
        
        // updating user profile in firestore
        await updateDoc(userRef, userData);

        return res.status(200).send({ msg: "User Info updated successfully", user });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "User update failed" });
    }
}


// User logout
export async function logoutUser(req, res) {
    try {
  
        return res.status(200).send({ msg: " User logged out successfully"});
    } catch (error) {
      return res.status(500).send({ error: "Logout failed" });
    }
  }
