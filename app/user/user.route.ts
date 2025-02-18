import { Router } from "express";
import { catchError } from "../common/middleware/catch-validation-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });
const publicRoutes = ["/login", "/create-user"];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

router.get(
  "/me",
  authenticateJWT,
  userController.getMe
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     description: Authenticate user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/login",
  userValidator.loginUser,
  catchError,
  passport.authenticate("login", { session: false }),
  userController.loginUser
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Register a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               active:
 *                 type: boolean
 *                 example: true
 *               role:
 *                 type: string
 *                 example: "USER"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  userValidator.createUser,
  catchError,
  userController.createUser
);
/**
 * @swagger
 * /users/getAllUser:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     description: Get a list of all registered users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Forbidden
 */
router.get("/getAllUser", authenticateJWT, userController.getAllUser);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Retrieve a specific user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  userValidator.validateUserId,
  catchError,
  authenticateJWT,
  userController.getUserById
);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Remove a user from the system (Admin access required).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  userValidator.validateUserId,
  catchError,
  authenticateJWT,
  roleAuth(["ADMIN"], publicRoutes),
  userController.deleteUser
);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update user details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.put(
  "/:id",
  userValidator.updateUser,
  catchError,
  authenticateJWT,
  userController.updateUser
);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Edit user details
 *     tags: [Users]
 *     description: Partially update user data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.patch(
  "/:id",
  userValidator.editUser,
  catchError,
  authenticateJWT,
  userController.editUser
);
/**
 * @swagger
 * /users/refreshToken:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Users]
 *     description: Generates a new access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "some-refresh-token"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/refresh-token",
  userValidator.refreshToken,
  catchError,
  userController.refreshToken
);
/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     description: Logs out a user by invalidating the session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticateJWT, userController.logout);

/**
 * @swagger
 * /users/upload-image:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server and stores it in the "uploads" folder.
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 path:
 *                   type: string
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: File upload failed.
 */
router.post("/upload-image", authenticateJWT, userController.uploadImage);

export default router;
