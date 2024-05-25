import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore"
import db from "../firestore.js"

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
const auth = getAuth();

// Register user
export async function  registerUser(req, res){

    try {
        const {email, password} = req.body;
        

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //user id
        console.log('User signed up successfully:', user.uid);

        // send verification email
        await sendEmailVerification(user);
       
        return res.status(200).send({ msg: "User registered successfully, Check email for verification code"});
        
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        // Handle signup errors here (e.g., display error messages to the user)
        console.error('Signup error:', errorCode, errorMessage);
        return res.status(500).send({ error: "User not created" });
    }
};

// User login
export async function loginUser(req, res){

    try {
        const {email, password} = req.body;
    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //user id
        console.log('User signed up successfully:', user.uid);
       
        return res.status(200).send({ msg: "User logged in successfully"});
        
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        // Handle signup errors here (e.g., display error messages to the user)
        console.error('Login error:', errorCode, errorMessage);
        return res.status(500).send({ error: "Login failed" });
    }

};

// user log out
export async function logoutUser(req, res){

    try {
        const {email, password} = req.body;
    
        const userCredential = await signOut(auth);
        const user = userCredential.user;

        //user id
        console.log('User signed up successfully:', user.uid);
       
        return res.status(200).send({ msg: "User logged out successfully"});
        
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        // Handle signup errors here (e.g., display error messages to the user)
        console.error('Login error:', errorCode, errorMessage);
        return res.status(500).send({ error: "LogOut failed" });
    }

};

