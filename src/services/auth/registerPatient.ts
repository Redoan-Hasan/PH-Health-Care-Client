"use server";
import z from "zod";
import { loginUser } from "./loginUser";

const registerUserZodSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: "Name must be at least 2 characters long" }),
    address: z
      .string()
      .min(1, { error: "Address must be at least 1 character long" }),
    email: z.email({ error: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { error: "Confirm Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
export const registerPatient = async (currentState: any, formData: any) => {
  try {
    const validatedData = registerUserZodSchema.safeParse({
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

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
    const registerData = {
      password: formData.get("password"),
      patient: {
        name: formData.get("name"),
        address: formData.get("address"),
        email: formData.get("email"),
      },
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));

    const response = await fetch(
      "http://localhost:5000/api/v1/user/create-patient",
      {
        method: "POST",
        body: newFormData,
      },
    );
    const result = await response.json();
    if (result.success) {
      await loginUser(currentState, formData);
    }
    return result;
  } catch (error: any) {
    console.log("error", error);
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Registration Failed."}` }
  }
};
