import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { createUserAccessTokens } from "../common/services/passport-jwt.service";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import userSchema from "./user.schema";

/**
 * Logs in a user by verifying credentials and generating access tokens.
 * @param {Object} data - Login credentials.
 * @param {string} data.email - User email.
 * @param {string} data.password - User password.
 * @returns {Promise<Object>} - Access and refresh tokens.
 * @throws {Error} - If user is not found.
 */
export const loginUser = async (data: { email: string; password: string }) => {
  const user = await getUserByEmail(data.email);
  if (user) {
    //type Guard
    const { password, ...userWithoutPassword } = user;
    const tokens = createUserAccessTokens(userWithoutPassword);
    await UserSchema.findByIdAndUpdate(
      user._id,
      { refreshToken: tokens.refreshToken },
      { new: true }
    );

    return tokens;
  } else {
    throw new Error("User not found");
  }
};

/**
 * Creates a new user.
 * @param {IUser} data - User details.
 * @returns {Promise<Object>} - Created user document.
 */
export const createUser = async (data: IUser) => {
  const result = await UserSchema.create({
    ...data,
    active: data?.active ?? true,
  });
  return result;
};

/**
 * Updates user details, including password hashing.
 * @param {string} id - User ID.
 * @param {IUser} data - Updated user details.
 * @returns {Promise<Object|null>} - Updated user document.
 */
export const updateUser = async (id: string, data: IUser) => {
  const { password, ...userWithoutPassword } = data;
  const hashPassword = await bcrypt.hash(password, 12);
  const result = await UserSchema.findOneAndUpdate(
    { _id: id },
    { ...userWithoutPassword, password: hashPassword },
    {
      new: true,
    }
  );
  return result;
};

/**
 * Edits user details without updating the password.
 * @param {string} id - User ID.
 * @param {Partial<IUser>} data - Partial user details.
 * @returns {Promise<Object|null>} - Updated user document.
 */
export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

/**
 * Deletes a user by ID.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} - Deletion result.
 */
export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne({ _id: id });
  return result;
};

/**
 * Retrieves a user by ID.
 * @param {string} id - User ID.
 * @returns {Promise<Object|null>} - User document.
 */
export const getUserById = async (id: string) => {
  const result = await UserSchema.findById(id).lean();
  return result;
};

/**
 * Retrieves all users.
 * @returns {Promise<Array<Object>>} - List of users.
 */
export const getAllUser = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};
/**
 * Retrieves a user by email.
 * @param {string} email - User email.
 * @returns {Promise<Object|null>} - User document.
 */
export const getUserByEmail = async (email: string) => {
  const result = await UserSchema.findOne({ email }).lean();
  return result;
};

/**
 * Refreshes access tokens using a refresh token.
 * @param {string} refreshToken - Refresh token.
 * @returns {Promise<Object>} - New access and refresh tokens.
 * @throws {Error} - If refresh token is invalid or user not found.
 */
export const refreshToken = async (refreshToken: string) => {
  // console.log(`Refreshing token: ${refreshToken}`);
  const jwtRefreshSecret = process.env.JWT_SECRET ?? "";

  if (!jwtRefreshSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as JwtPayload;

  if (!decoded || !decoded._id) {
    throw new Error("Invalid refresh token");
  }

  const user = await UserSchema.findById(decoded._id);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }
  const { password, ...userWithoutPassword } = user;
  const tokens = createUserAccessTokens(userWithoutPassword);

  await UserSchema.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};
/**
 * Logs out a user by clearing the refresh token.
 * @param {Omit<IUser, "password">} data - User data without password.
 * @returns {Promise<void>} - Resolves when logout is complete.
 */
export const logout = async (data: Omit<IUser, "password">) => {
  // console.log(data);
  await UserSchema.findByIdAndUpdate(data._id, { refreshToken: null });
  return;
};
