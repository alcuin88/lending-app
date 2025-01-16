"use server";

import { createSession, invalidateSession, generateSessionToken } from "@/lib/auth";
import { SignupFormSchema } from "@/lib/definitions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SignUp(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validateFields = SignupFormSchema.safeParse({
    email: email,
    password: password
  });

  if(!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const user = await createUser(email, hashedPassword) as User;
    const token = generateSessionToken();
    await createSession(token, user?.user_id);
    redirect("/training");
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

  const existingUser =
    await getUserByEmail(email) as User;
 
  if (!existingUser) {
    return {
      errors: {
        login: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        login: "Could not authenticate user, please check your credentials.",
      },
    };
  }
  const token = await generateSessionToken() ;
  await createSession(token, existingUser.user_id);
  redirect("/dashboard")
}

export async function auth(mode: string, prevState: unknown, formData: FormData) {
  if(mode === "login") {
    return login(prevState, formData);
  }
  return SignUp(prevState, formData);
}

export async function logout() {
  const token = (await cookies()).get('session')?.value as string
  await invalidateSession(token);
  redirect("/");
}