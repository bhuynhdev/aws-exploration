import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AWSHome: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userId }) => {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <title>Bao Huynh&apos;s app</title>
        <meta name="description" content="An app to deploy on AWS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gray-800 text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Bao Huynh - Cloud computing - AWS
        </h1>
        {userId ? (
          <div className="text-lg">
            <p>
              You&apos;re currently logged in as userID: <code>{userId}</code>
            </p>
            <p>
              See your profile{" "}
              <Link href={`${asPath}/profile`} className="text-blue-500 underline">
                here
              </Link>{" "}
            </p>
            <button
              className="my-8 rounded-md bg-blue-500 px-4 py-2 text-lg text-white"
              onClick={() => void signOut({ callbackUrl: "/aws" })}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
            <Link
              href={`${asPath}/login`}
              className="w-24 rounded-md bg-blue-500 py-2 text-center text-lg text-white"
            >
              Login
            </Link>
            <Link
              href={`${asPath}/register`}
              className="w-24 rounded-md bg-blue-500 py-2 text-center text-lg text-white"
            >
              Register
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default AWSHome;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, {
    callbacks: {
      session: ({ session, token }) => {
        console.log(token);
        if (session?.user && token.sub) session.user.id = token.sub;
        return session;
      },
    },
  });
  if (session && session.user.id) {
    return { props: { userId: session.user.id } };
  }
  return {
    props: { userId: null },
  };
};
