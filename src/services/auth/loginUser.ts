/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
const loginUserZodSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" }),
});

export const loginUser = async (currentState: any, formData: any) => {
  try {
    const redirectTo: string = formData.get("redirect");
    console.log("redirect from server action", redirectTo);
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const validatedData = loginUserZodSchema.safeParse(loginData);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }
    console.log(validatedData, "validatedData");
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const result = await response.json();
    console.log("result", result);
    console.log("response", response);
    const setCookieHeader = response.headers.getSetCookie();
    console.log(setCookieHeader, "setCookiesHeader");
    if (setCookieHeader && setCookieHeader.length > 0) {
      setCookieHeader.forEach((cookie) => {
        console.log("for each cookie", cookie);
        const parsedCookie = parse(cookie);
        console.log("parsedCookie", parsedCookie);
        if (parsedCookie.accessToken) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie.refreshToken) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("Failed to retrieve authentication cookies.");
    }
    if (!accessTokenObject) {
      throw new Error("Access token not found in cookies.");
    }
    if (!refreshTokenObject) {
      throw new Error("Refresh token not found in cookies.");
    }
    console.log(
      "accessToken",
      accessTokenObject,
      "refreshToken",
      refreshTokenObject,
    );
    const storeCookie = await cookies();
    storeCookie.set("accessToken", accessTokenObject.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: accessTokenObject.sameSite || "none",
      path: accessTokenObject.path || "/",
      maxAge: parseInt(refreshTokenObject["maxAge"] || "1000"),
    });
    storeCookie.set("refreshToken", refreshTokenObject.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: refreshTokenObject.sameSite || "none",
      path: refreshTokenObject.path || "/",
      maxAge: parseInt(refreshTokenObject["maxAge"] || "1000"),
    });
    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject.accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    );
    if (typeof verifiedToken === "string") {
      throw new Error("Invalid Token");
    };
    const userRole: UserRole = verifiedToken.role;
    if(redirectTo){
      const requestedPath = redirectTo.toString();
      if(isValidRedirectForRole(requestedPath, userRole)){
        redirect(requestedPath);
      }
      else{
        redirect(getDefaultDashboardRoute(userRole));
      }
    }else{
      redirect(getDefaultDashboardRoute(userRole));
    }
    const redirectPath = redirectTo? redirectTo.toString() : getDefaultDashboardRoute(userRole);
    redirect(redirectPath);
  } catch (error:any) {
    console.log(error);
    if(error?.digest?.startsWith('NEXT_REDIRECT')){
      throw error;
    }
    return {
      error: "An error occurred while logging in. Please try again later.",
    };
  }
};
