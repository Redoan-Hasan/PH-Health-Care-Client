"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const registerPatient = async (currentState: any, formData: any) => {
  try {
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

    const response = await fetch("http://localhost:5000/api/v1/user/create-patient", {
      method: "POST",
      body: newFormData,
    }).then((res) => res.json());
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
