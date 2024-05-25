import jwt from 'jsonwebtoken';
import 'dotenv/config';

/** auth middleware */
export default async function Auth(req, res, next){
    try {
        // Access the authorization header to validate the request
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Authentication Failed" });
        }
      
        // Extract the token from the authorization header
        const token = authHeader.split(" ")[1];
      
        // Retrieve the user details for the logged-in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
      
        req.user = decodedToken;
      
        next()
      } catch (error) {
        res.status(500).json({ error: "User Authentication Failed" });
      }
      
}