import AuthForm from "@/components/auth-form";
import { Mode } from "@/lib/constants";

type SearchParams = Promise<{ [key: string]: Mode }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const formMode = searchParams.mode || Mode.login;
  return <AuthForm mode={formMode} />;
}
