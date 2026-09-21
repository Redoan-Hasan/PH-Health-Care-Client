import { UserInfo } from "@/types/user.interface";
import { getCookie } from "./tokenHandlers";
import jwt, { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserInfo = async (): Promise<UserInfo | any> => {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) return null;
    const verifiedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload;
    if (!verifiedToken) return null;
    const userInfo: UserInfo = {
        name: verifiedToken.name  || "unknown user",
        email: verifiedToken.email,
        role: verifiedToken.role,
    }
    return userInfo;
  } catch (error) {
    console.log("error from getUserInfo:", error);
    return null;
  }
};
