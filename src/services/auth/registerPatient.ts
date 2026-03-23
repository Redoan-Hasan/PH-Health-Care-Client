"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const registerPatient = async(currentState: any, formData: any)=>{
      console.log("current state", currentState);
      console.log("form data", formData.get("name"));
      return {success:true}
    }