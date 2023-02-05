import { TRPCClientError } from "@trpc/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { api } from "../utils/api";

const Register = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const signUp = api.auth.signUp.useMutation();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const password = form.get("password");
    const firstName = form.get("firstName");
    const lastName = form.get("lastName");
    const email = form.get("email");

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string"
    ) {
      return setError("Problem submitting form. Form not submitted correctly");
    }
    const signUpInfo = { username, password, firstName, lastName, email };
    try {
      const user = await signUp.mutateAsync(signUpInfo);
      // Make the POST call to login
      await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username, password, csrfToken }),
      });
      // Redirect to /profile after successful register
      router.push("/profile");
    } catch (err) {
      if (err instanceof TRPCClientError) {
        setError(JSON.parse(err.message)[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occured");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-blue-500 text-white">
      <form onSubmit={handleSignup} className="mt-28 grid w-[min(75%,400px)] gap-3 overflow-auto">
        <div className="formGroup grid gap-2">
          <label htmlFor="register-username">Username</label>
          <input
            type="text"
            name="username"
            id="register-username"
            className="rounded-sm px-3 py-1 text-gray-900"
            required
          />
        </div>
        <div className="formGroup grid gap-2">
          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            name="password"
            id="register-password"
            className="rounded-sm px-3 py-1 text-gray-900"
            required
          />
        </div>
        <div className="formGroup grid gap-2">
          <label htmlFor="register-fname">First name</label>
          <input
            type="text"
            name="firstName"
            id="register-fname"
            className="rounded-sm px-3 py-1 text-gray-900"
            required
          />
        </div>
        <div className="formGroup grid gap-2">
          <label htmlFor="register-lname">Last name</label>
          <input
            type="text"
            name="lastName"
            id="register-lname"
            className="rounded-sm px-3 py-1 text-gray-900"
            required
          />
        </div>
        <div className="formGroup grid">
          <label htmlFor="register-email">Email</label>
          <input
            type="email"
            name="email"
            id="register-email"
            className="rounded-sm px-3 py-1 text-gray-900"
            required
          />
        </div>
        <button type="submit" className="mx-auto mt-6 w-min rounded-md bg-blue-800 px-4 py-2">
          Register
        </button>
        {!!error && <p className="rounded-md bg-red-500 p-3 text-center">{error}</p>}
      </form>
    </main>
  );
};

export default Register;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
