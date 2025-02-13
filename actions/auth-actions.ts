"use server";

import { createSession } from "@/lib/auth";
import { Mode } from "@/lib/constants";
import { SignupFormSchema } from "@/lib/definitions";
import axios from "axios";
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

  const url = "http://localhost:3333/auth/signup";
  const user = await userApi(email, password, url);
  if (!user.success) {
    return {
      errors: {
        error: [user.message],
      },
    };
  }
  const data: { access_token: string; expires_in: string } = user.data;

  await createSession(data);
  redirect("/dashboard");
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

  const url = "http://localhost:3333/auth/login";
  const user = await userApi(email, password, url);

  if (!user.success) {
    return {
      errors: {
        error: [user.message],
      },
    };
  }
  const data: { access_token: string; expires_in: string } = user.data;

  await createSession(data);
  redirect("/dashboard");
}

export async function auth(mode: Mode, prevState: unknown, formData: FormData) {
  if (mode === Mode.login) {
    return login(prevState, formData);
  }
  return SignUp(prevState, formData);
}

export async function logout() {
  (await cookies()).delete("access_token");
  (await cookies()).delete("clientId");
  redirect("/");
}

export async function userApi(email: string, password: string, url: string) {
  try {
    const response = await axios.post(
      url,
      new URLSearchParams({ email, password }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while connecting to the server.",
      };
    } else {
      return {
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }
}
