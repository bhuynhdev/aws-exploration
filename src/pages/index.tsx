import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";

import { FormEvent } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const credentials = {
      username: form.get("username"),
      password: form.get("password"),
    };
    await signIn("credentials", { ...credentials, callbackUrl: "/profile" });
  };

  return (
    <>
      <Head>
        <title>Bao Huynh's app</title>
        <meta name="description" content="An app to deploy on AWS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Link href="/register" className="rounded-md bg-blue-500 px-4 py-2">
          Register
        </Link>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Bao Huynh - Cloud computing
          </h1>
          <form className="flex w-72 flex-col gap-3 text-white" onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="formGroup grid">
              <label htmlFor="login-username">Username</label>
              <input
                type="text"
                name="username"
                id="login-username"
                className="rounded-sm px-2 py-1 text-black"
              />
            </div>
            <div className="formGroup grid">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                name="password"
                id="login-password"
                className="rounded-sm px-2 py-1 text-black"
              />
            </div>
            <button>Actual signin</button>
            <button type="button" onClick={() => void signOut()}>
              Actual signout
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, {});
  if (session) {
    return { redirect: { destination: "/profile", permanent: false } };
  }

  return {
    props: { csrfToken: await getCsrfToken(context) },
  };
}
