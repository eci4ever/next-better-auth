"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function signUp(data: FormData) {
  // console.log("Sign Up Data:", data);
  const rawFormData = {
    name: data.get("name") as string,
    email: data.get("email") as string,
    password: data.get("password") as string,
  };

  const { name, email, password } = rawFormData;

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
    });
  } catch (error) {
    console.error("Sign Up Error:", error);
  }
  redirect("/dashboard");
}
