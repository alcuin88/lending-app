import { cookies } from "next/headers";

interface token {
  access_token: string;
  expires_in: string;
  email: string;
}
export async function createSession(token: token) {
  const addMilliseconds = Number(token.expires_in) * 1000;
  const now = new Date();
  const expires = now.getTime() + addMilliseconds;

  const cookieStore = await cookies();
  cookieStore.set("access_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expires,
  });
  cookieStore.set("user_email", token.email, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expires,
  });
}
