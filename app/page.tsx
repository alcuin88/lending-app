import AuthForm from "@/components/auth-form";

type SearchParams = Promise<{ [key: string]: string }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const formMode = searchParams.mode || "login";
  return <AuthForm mode={formMode} />;
}
