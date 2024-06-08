// index.js or app.js
import express from 'express';
import cors from 'cors';
import routes from './route/routes.js';

import bodyParser from 'body-parser';



const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data
app.use(bodyParser.json());

// api swagger documentation
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const port = 8080;
/* swagger */
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "API Endpoints",
            version: '5.0.0'
        }
    },
    apis: ['server.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
// route for swagger docs
routes.use('/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(swaggerDocs));

app.use('/', routes); // Mount the routes

try {
    app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
    });
} catch (error) {
    console.log("Cannot connect to the server");
}

/* SWAGGER API DOCS*/

/* USERS API */
// register user
// user login
/**
 * @swagger 
 * /users/register:
 *    post:
 *      tags:
 *      - User APIs
 *      summary: Register new user
 *      description: Registering new user
 *      parameters:
 *      - name: User Credentials
 *        description: Enter user data
 *        in: body
 *        type: string
 *        required: true
 *        example: {
 *          "email" : "tdykeff609@tormails.com",
 *          "password" : "#itworks",
 *          "name" : "Roronoa Zoro",
 *          "phoneNumber" : "+23467817181",
 *          "school" : "Marine Fold",
 *          "faculty" : "Electronics",
 *          "department" : "Marine Engineering"
 *         }
 *      responses:
 *        200:
 *          description: User Registered successfully
 *        400:
 *          description: Email already in use 
 *        500:
 *          description: User not created
 * 
 */
// user login
/**
 * @swagger 
 * /users/login:
 *    post:
 *      tags:
 *      - User APIs
 *      summary: Login as user
 *      description: User logging in
 *      parameters:
 *      - name: User Credentials
 *        description: Enter user data
 *        in: body
 *        type: string
 *        required: true
 *        example: {
 *          "email" : "tdykeff609@tormails.com",
 *          "password" : "#itworks"
 *         }
 *      responses:
 *        200:
 *          description: Success
 *        404:
 *          description: User not found
 * 
 */
//Get user details
/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *     - User APIs
 *     summary: Get user  details
 *     description: User profile 
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       type: string
 *       required: true
 *       description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       404:
 *         description: User not found
 */

//Update
/**
 * @swagger 
 * /users/update:
 *    put:
 *      tags:
 *      - User APIs
 *      summary: Modify user data
 *      description: Changing user data
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      - name: Update user data
 *        description: Modify or add to data
 *        in: body
 *        type: string
 *        required: false
 *        example: {
 *               "faculty": "Navy"
 *               }
 *      responses:
 *        201:
 *          description: Success
 *        401:
 *          description: Missing user token
 *        402:
 *          description: User Authentication Failed
 *        500:
 *          description: User update failed
 * 
 */
/* VIDEOS API */
//Get user details
/**
 * @swagger
 * /videos/metadata:
 *   get:
 *     tags:
 *     - Video APIs
 *     summary: Get all video details
 *     description: All Videos Metadata
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */

//Upload a video
/**
 * @swagger
 * /videos/upload:
 *   post:
 *     tags:
 *       - Video APIs
 *     summary: Upload a video
 *     description: Upload a video with metadata
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: video
 *         type: file
 *         required: true
 *         description: The video file to upload
 *       - in: formData
 *         name: thumbnail
 *         type: file
 *         required: true
 *         description: The thumbnail image file to upload
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *         description: The title of the video
 *       - in: formData
 *         name: course
 *         type: string
 *         required: true
 *         description: Course video addresses
 *       - in: formData
 *         name: subject
 *         type: string
 *         required: true
 *         description: Subject video addresses
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: Description of the video
 *       - in: formData
 *         name: duration
 *         type: string
 *         required: true
 *         description: Duration of the video - hh:mm:ss
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */

//Get user videos
/**
 * @swagger
 * /videos/user:
 *   get:
 *     tags:
 *     - Video APIs
 *     summary: Get videos uplaoded by user
 *     description: User Videos
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       type: string
 *       required: true
 *       description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       404:
 *         description: User not found
 */

//Delete a video
/**
 * @swagger
 * /videos/delete:
 *   post:
 *     tags:
 *       - Video APIs
 *     summary: Delete a video
 *     description: user removing their video
 *     parameters:
 *     - name: Video metadata ID
 *       description: ID of video meta data
 *       in: body
 *       type: string
 *       required: false
 *       example: {
 *               "videoMetadataID": ""
 *               }
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: Missing video metadata ID
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
