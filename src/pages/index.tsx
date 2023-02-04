import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";

import { api } from "../utils/api";
import { env } from "../env/client.mjs";
import { FormEvent, ReactEventHandler } from "react";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const signUp = api.auth.signUp.useMutation();

  const loginSubmitURL = new URL("/api/auth/callback/credentials", env.NEXT_PUBLIC_URL);
  // loginSubmitURL.searchParams.set("callbackUrl", new URL("/hoho", env.NEXT_PUBLIC_URL).toString());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn("credentials", { username: "bao", password: "bao" });
  };

  const handleSignup = async () => {
    await signUp.mutateAsync({ username: "bao", password: "bao" });
  };

  return (
    <>
      <Head>
        <title>Bao Huynh's app</title>
        <meta name="description" content="An app to deploy on AWS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
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
            <button type="button" onClick={handleSignup}>
              Register
            </button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.username}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
