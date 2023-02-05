import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { api } from "../utils/api";

const Profile: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  // Run the query only when a user has looged in
  const { data: profileInfo } = api.auth.getProfile.useQuery(undefined, { enabled: !!user });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-800">
      <div className="card flex w-[min(75%,400px)] flex-col items-stretch justify-center gap-3 rounded-md bg-white p-7 shadow-md">
        <h1 className="text-3xl font-bold">Your profile info</h1>
        <div className="infoGroup">
          <p className="italic">Username</p>
          <p>{profileInfo?.username}</p>
        </div>
        <div className="infoGroup">
          <p className="italic">Email</p>
          <p>{profileInfo?.email}</p>
        </div>
        <div className="infoGroup">
          <p className="italic">First name</p>
          <p>{profileInfo?.firstName}</p>
        </div>
        <div className="infoGroup">
          <p className="italic">Last name</p>
          <p>{profileInfo?.lastName}</p>
        </div>
      </div>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-lg text-white"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </button>
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
