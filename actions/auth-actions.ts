"use server";

import { createSession } from "@/lib/auth";
import { Mode } from "@/lib/constants";
import { SignupFormSchema } from "@/lib/definitions";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface payload {
  email: string;
  password: string;
  url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function formSelect(
  mode: Mode,
  prevState: unknown,
  formData: FormData
) {
  if (mode === Mode.login) {
    return login(prevState, formData);
  }
  return SignUp(prevState, formData);
}

async function SignUp(prevState: unknown, formData: FormData) {
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

  const url = `${API_URL}/auth/signup`;
  const payload: payload = {
    email,
    password,
    url,
  };
  return auth(payload);
}

async function login(prevState: unknown, formData: FormData) {
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

  const url = `${API_URL}/auth/login`;
  console.log(url);
  const payload: payload = {
    email,
    password,
    url,
  };
  return auth(payload);
}

async function auth(payload: payload) {
  const user = await userApi(payload.email, payload.password, payload.url);

  if (!user.success) {
    return {
      errors: {
        error: [user.message],
      },
    };
  }
  const data: { access_token: string; expires_in: string; email: string } =
    user.data;

  await createSession(data);
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete("access_token");
  (await cookies()).delete("user_email");
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
