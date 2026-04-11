"use server";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export  const loginUser = async (currentState:any, formData:any) => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }).then((res) => res.json());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    return {error: "An error occurred while logging in. Please try again later.",}
  }
}