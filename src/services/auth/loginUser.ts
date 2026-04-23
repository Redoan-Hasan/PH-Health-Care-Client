"use server";

import z from "zod";
const loginUserZodSchema = z.object({
  email:z.email({
    error: "Please enter a valid email address"
  }),
  password:z.string().min(6,{ error: "Password must be at least 6 characters long"}),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export  const loginUser = async (currentState:any, formData:any) => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const validatedData = loginUserZodSchema.safeParse(loginData);
    if(!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.issues.map((issue) =>{
          return {
            field: issue.path[0],
            message: issue.message,
          }
        })
      }
    }
    console.log(validatedData,"validatedData");
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
    const result = await response.json();
    console.log("result", result);
    console.log("response", response);
    const setCookiesHeader = response.headers.getSetCookie();
    console.log("setCookiesHeader", setCookiesHeader);
    return result;
  } catch (error) {
    console.log(error);
    return {error: "An error occurred while logging in. Please try again later.",}
  }
}