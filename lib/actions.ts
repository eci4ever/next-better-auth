"use server";

import { APIError } from "better-auth";
import { redirect } from "next/navigation";
import { auth } from "./auth";

interface State {
	errorMessage?: string | null;
}

export async function signUp(prevState: State, data: FormData) {
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
		if (error instanceof APIError) {
			switch (error.status) {
				case "UNPROCESSABLE_ENTITY":
					return { errorMessage: "User already exists." };
				case "BAD_REQUEST":
					return { errorMessage: "Invalid email." };
				default:
					return { errorMessage: "Something went wrong." };
			}
		}
		// Log sign up error for debugging
		throw error;
	}
	// Don't redirect to dashboard - let user sign in manually
	redirect("/login?message=Account created successfully. Please sign in.");
}

export async function signIn(prevState: State, formData: FormData) {
	const rawFormData = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { email, password } = rawFormData;
	// Log credentials for debugging
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});
		// Log successful sign in
	} catch (error) {
		if (error instanceof APIError) {
			switch (error.status) {
				case "UNAUTHORIZED":
					return { errorMessage: "User Not Found." };
				case "BAD_REQUEST":
					return { errorMessage: "Invalid email." };
				default:
					return { errorMessage: "Something went wrong." };
			}
		}
		// Log sign up error for debugging
		throw error;
	}
	redirect("/dashboard");
}
