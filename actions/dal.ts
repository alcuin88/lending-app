import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const token = (await cookies()).get("access_token")?.value as string;
  const email = (await cookies()).get("user_email")?.value as string;
  if (!token) {
    redirect("/");
  }

  return { token, email };
});
