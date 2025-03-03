"use server";

import { PostAPI } from "@/api";
import { createSession } from "@/lib/auth";
import { Mode } from "@/lib/constants";
import { SignupFormSchema } from "@/lib/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const payload = {
    email,
    password,
  };
  return auth(payload, url);
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
  const payload = {
    email,
    password,
  };
  return auth(payload, url);
}

async function auth(payload: { email: string; password: string }, url: string) {
  const user = await PostAPI(payload, url);

  if (!user.success) {
    return {
      errors: {
        error: [user.errors],
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
