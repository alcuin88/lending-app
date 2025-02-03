"use server";

import { createSession } from "@/lib/auth";
import { Mode } from "@/lib/constants";
import { SignupFormSchema } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SignUp(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validateFields = SignupFormSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  try {
    const url = "http://localhost:3333/auth/signup";
    await userApi(email, password, url);
    redirect("/login");
  } catch (error) {
    if (isSqliteConstraintUniqueError(error)) {
      return {
        errors: {
          email: "Email already exists.",
        },
      };
    }
    throw error;
  }
}

function isSqliteConstraintUniqueError(
  error: unknown
): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
  );
}

export async function login(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validateFields = SignupFormSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  try {
    const url = "http://localhost:3333/auth/login";
    const response = await userApi(email, password, url);
    if (!response?.ok) {
      return {
        error: `Error: ${response?.status}`,
      };
    }
    const data: { access_token: string; expires_in: string } =
      await response.json();
    console.log(data);
    await createSession(data);
    redirect("/dashboard");
  } catch (error) {
    if (isSqliteConstraintUniqueError(error)) {
      return {
        errors: {
          email: "Email already exists.",
        },
      };
    }
    throw error;
  }
}

export async function auth(mode: Mode, prevState: unknown, formData: FormData) {
  if (mode === Mode.login) {
    return login(prevState, formData);
  }
  return SignUp(prevState, formData);
}

export async function logout() {
  (await cookies()).delete("access_token");
  redirect("/");
}

export async function userApi(email: string, password: string, url: string) {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email, password }).toString(),
    });
  } catch (error) {
    console.log("Error creating user:", error);
  }
}
