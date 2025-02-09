import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import { createUserAccessTokens } from "../common/services/passport-jwt.service";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import userSchema from "./user.schema";

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

export const createUser = async (data: IUser) => {
  const result = await UserSchema.create({
    ...data,
    active: data?.active ?? true,
  });
  return result;
};

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

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne({ _id: id });
  return result;
};

export const getUserById = async (id: string) => {
  const result = await UserSchema.findById(id).lean();
  return result;
};

export const getAllUser = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};
export const getUserByEmail = async (email: string) => {
  const result = await UserSchema.findOne({ email }).lean();
  return result;
};

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
export const logout = async (data: Omit<IUser, "password">) => {
  // console.log(data);
  await UserSchema.findByIdAndUpdate(data._id, { refreshToken: null });
  return;
};
