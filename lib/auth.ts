import { cookies } from "next/headers";

export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}
