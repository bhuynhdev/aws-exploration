import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { FormEvent } from "react";

const Login: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
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
    <main>
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
