import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bao Huynh's app</title>
        <meta name="description" content="An app to deploy on AWS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-blue-900">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Bao Huynh - Cloud computing
        </h1>
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <Link
            href="/login"
            className="w-24 rounded-md bg-blue-500 py-2 text-center text-lg text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="w-24 rounded-md bg-blue-500 py-2 text-center text-lg text-white"
          >
            Register
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
