import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../firestore.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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

        // Create a JWT token
        const token = jwt.sign(
            {
                userId: user.uid
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
       
        return res.status(200).send({ msg: "User logged in successfully", email,
        token});
        
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
    
        // Handle signup errors here (e.g., display error messages to the user)
        console.error('Login error:', errorCode, errorMessage);
        return res.status(500).send({ error: "Login failed" });
    }

};

