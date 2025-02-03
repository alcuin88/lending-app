import { cookies } from "next/headers";

interface token {
  access_token: string;
  expires_in: string;
}
export async function createSession(token: token) {
  const date = new Date();
  const addDay = Number.parseInt(token.expires_in.charAt(0), 10);
  date.setDate(date.getDate() + addDay);

  const cookieStore = await cookies();
  cookieStore.set("access_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: date,
  });
}
