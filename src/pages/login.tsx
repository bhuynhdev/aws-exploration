import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Login: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const credentials = {
      username: form.get("username"),
      password: form.get("password"),
    };
    const res = await signIn("credentials", { ...credentials, redirect: false });
    if (!res) {
      return setError("Unknown error occured when signin");
    }
    if (!res.ok) {
      if (res.status === 401) {
        return setError("Invalid username/password");
      }
      return setError(res.error || "Unknown error");
    }
    // Redirect to "/profile" after successful login
    return router.push("/profile");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold">Login</h1>
      <p>
        New to this site? Head to{" "}
        <Link className="text-blue-500 underline" href="/register">
          Register
        </Link>
      </p>
      <form className="grid w-[min(75%,400px)] gap-3" onSubmit={(e) => void handleSubmit(e)}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="formGroup grid gap-2">
          <label htmlFor="login-username">Username</label>
          <input
            type="text"
            name="username"
            id="login-username"
            className="rounded-sm px-2 py-1 text-black"
            required
          />
        </div>
        <div className="formGroup grid gap-2">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            name="password"
            id="login-password"
            className="rounded-sm px-2 py-1 text-black"
            required
          />
        </div>
        <button className="mx-auto mt-6 w-min rounded-md bg-blue-500 px-4 py-2">Login</button>
        {!!error && <p className="rounded-md bg-red-500 p-3 text-center">{error}</p>}
      </form>
    </main>
  );
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, {});
  if (session) {
    return { redirect: { destination: "/profile", permanent: false } };
  }

  return {
    props: { csrfToken: await getCsrfToken(context) },
  };
}
