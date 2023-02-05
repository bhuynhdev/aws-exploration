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
      console.log("Error during signup", err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSignup}>
        <div className="formGroup">
          <label htmlFor="register-username">Username</label>
          <input type="text" name="username" id="register-username" />
        </div>
        <div className="formGroup">
          <label htmlFor="register-password">Password</label>
          <input type="password" name="password" id="register-password" />
        </div>
        <div className="formGroup">
          <label htmlFor="register-fname">First name</label>
          <input type="text" name="firstName" id="register-fname" />
        </div>
        <div className="formGroup">
          <label htmlFor="register-lname">Last name</label>
          <input type="text" name="lastName" id="register-lname" />
        </div>
        <div className="formGroup">
          <label htmlFor="register-email">Email</label>
          <input type="email" name="email" id="register-email" />
        </div>
        <button type="submit">Register</button>
        <p className="bg-red-400">{error}</p>
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
