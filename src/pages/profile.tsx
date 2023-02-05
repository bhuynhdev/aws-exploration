import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { api } from "../utils/api";

const Profile: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  // Run the query only when a user has looged in
  const profileInfo = api.auth.getProfile.useQuery(undefined, { enabled: !!user });
  return (
    <main>
      <pre>{JSON.stringify(profileInfo.data, null, 2)}</pre>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
    </main>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, {
    callbacks: {
      session: ({ session, token }) => {
        if (session?.user && token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
  });
  if (session) {
    return {
      props: { user: session.user.email },
    };
  }
  return { redirect: { destination: "/", permanent: false } };
};
