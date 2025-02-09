import { Router } from "express";
import { catchError } from "../common/middleware/catch-validation-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });
const publicRoutes = ["/login", "/create-user"];

router
  .post(
    "/login",
    userValidator.loginUser,
    catchError,
    passport.authenticate("login", { session: false }),
    userController.loginUser
  )
  .post("/", userValidator.createUser, catchError, userController.createUser)
  .get("/getAllUser", authenticateJWT, userController.getAllUser)
  .get(
    "/:id",
    userValidator.validateUserId,
    catchError,
    authenticateJWT,
    userController.getUserById
  )
  .delete(
    "/:id",
    userValidator.validateUserId,
    catchError,
    authenticateJWT,
    roleAuth(["ADMIN"], publicRoutes),
    userController.deleteUser
  )
  .put(
    "/:id",
    userValidator.updateUser,
    catchError,
    authenticateJWT,
    userController.updateUser
  )
  .patch(
    "/:id",
    userValidator.editUser,
    catchError,
    authenticateJWT,
    userController.editUser
  )
  .post(
    "/refreshToken",
    userValidator.refreshToken,
    catchError,
    userController.refreshToken
  )
  .post(
    "/logout",
    authenticateJWT,
    userController.logout
  );

export default router;
