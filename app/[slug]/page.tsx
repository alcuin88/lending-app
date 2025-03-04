import AuthForm from "@/components/auth/auth-form";
import { Mode } from "@/lib/constants";

export default async function Auth({
  params,
}: {
  params: Promise<{
    slug: Mode;
  }>;
}) {
  const formMode = (await params).slug || Mode.login;

  return <AuthForm mode={formMode} />;
}
