/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { parse } from "cookie";
import { cookies } from "next/headers";
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
    console.log(setCookieHeader,"setCookiesHeader");
    if (setCookieHeader && setCookieHeader.length > 0) {
      setCookieHeader.forEach((cookie) => {
        console.log("for each cookie",cookie);
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
    console.log("accessToken", accessTokenObject, "refreshToken", refreshTokenObject);
    const storeCookie = await cookies();
    storeCookie.set("accessToken", accessTokenObject.accessToken,{
      httpOnly: true,
      secure: true,
      sameSite: accessTokenObject.sameSite || "none",
      path: accessTokenObject.path || "/",
      maxAge: parseInt(refreshTokenObject["maxAge"] || "1000")
    });
    storeCookie.set("refreshToken", refreshTokenObject.refreshToken,{
      httpOnly: true,
      secure: true,
      sameSite: refreshTokenObject.sameSite || "none",
      path: refreshTokenObject.path || "/",
      maxAge: parseInt(refreshTokenObject["maxAge"] || "1000")
    });
    return result;
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while logging in. Please try again later.",
    };
  }
};
