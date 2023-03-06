import { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";

type ChatMessaage = {
  content: string;
  author: "bot" | "user";
  key: string;
};

type GCPUserInfo = {
  firstName: string;
  lastName: string;
  email: string;
} | null;

const QAS = [
  {
    question: "Does the college have a football team?",
    answer: "Yes, UC has the Cincinnat Bearcats, a proud member of the Big 12 Conference",
  },
  {
    question: "Does it have Computer Science Major?",
    answer:
      "Yes, UC has Computer Science major belonging to the College of Engineering and Applied Science",
  },
  {
    question: "What is the in-state tuition?",
    answer:
      "In-state tuition of UC is $12,598/year for Uptown campus, $6,086/year for Clermont campus, and $6,492/year for Blue Ash campus",
  },
  {
    question: "Does its have on campus housing?",
    answer:
      "Yes UC offers on-campus housing with various dorm options: Daniels, Scioto, Marian Spencer, etc.",
  },
];

const GCPHome: NextPage = () => {
  const [userInfo, setUserInfo] = useState<GCPUserInfo>(null);
  const [error, setError] = useState("");

  const handleUserInfoSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName");
    const lastName = form.get("lastName");
    const email = form.get("email");

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string"
    ) {
      return setError("Problem submitting form. Form not submitted correctly");
    }
    setUserInfo({ firstName, lastName, email });
  };

  return (
    <>
      <Head>
        <title>Bao Huynh&apos;s app</title>
        <meta name="description" content="An app to deploy on AWS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-800 text-white md:gap-8">
        <h1 className="text-3xl font-bold">{!userInfo ? "Login / Register" : "Chatbot"}</h1>
        {!userInfo && (
          <form className="grid w-[min(75%,400px)] gap-3" onSubmit={handleUserInfoSubmit}>
            <div className="formGroup grid gap-2">
              <label htmlFor="register-username">First name</label>
              <input
                type="text"
                name="firstName"
                id="firstname"
                className="rounded-sm px-3 py-1 text-gray-900"
                required
              />
            </div>
            <div className="formGroup grid gap-2">
              <label htmlFor="register-username">Last name</label>
              <input
                type="text"
                name="lastName"
                id="lastname"
                className="rounded-sm px-3 py-1 text-gray-900"
                required
              />
            </div>
            <div className="formGroup grid gap-2">
              <label htmlFor="register-username">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="rounded-sm px-3 py-1 text-gray-900"
                required
              />
            </div>
            <button type="submit" className="mx-auto mt-6 w-min rounded-md bg-blue-500 px-4 py-2">
              Submit
            </button>
            {!!error && <p className="rounded-md bg-red-500 p-3 text-center">{error}</p>}
          </form>
        )}
        {userInfo && <Chatbot userInfo={userInfo} />}
      </main>
    </>
  );
};

export default GCPHome;

const Chatbot = ({ userInfo }: { userInfo: NonNullable<GCPUserInfo> }) => {
  const [messages, setMessages] = useState<ChatMessaage[]>([
    { author: "bot", content: "Hi! What would you like to ask today", key: "bot1" },
  ]);
  return (
    <div className="flex h-4/5 w-4/5 flex-col justify-between sm:h-3/5 sm:w-1/2">
      <div className="chatbox flex flex-col gap-4">
        {messages.map(({ author, key, content }) => (
          <div
            key={key}
            className={`message max-w-[70%] ${author === "bot" ? "self-start" : "self-end"}`}
          >
            <span className="font-bold">{author.toUpperCase()}</span>: {content}
          </div>
        ))}
      </div>
      {messages.length == 1 && (
        <div className="user-input relative flex-1">
          <div className="absolute bottom-0 right-0 flex w-72 flex-col gap-2">
            {QAS.map(({ question, answer }, index) => (
              <button
                className="rounded-md bg-pink-700 px-4 py-2 text-left"
                key={index}
                onClick={(e) => {
                  setMessages((messages) => [
                    ...messages,
                    { author: "user", content: question, key: "user1" },
                  ]);
                  setTimeout(() => {
                    setMessages((messages) => {
                      return [
                        ...messages,
                        {
                          author: "bot",
                          key: "bot2",
                          content: answer,
                        },
                      ];
                    });
                  }, 600);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      {messages.length == 3 && (
        <div className="self-center rounded-md bg-pink-700 p-3">
          <p className="text-lg font-bold">END OF CONVERSATION</p>
          <p>
            User information
            <ul className="list-disc">
              <li className="ml-6">First name: {userInfo.firstName}</li>
              <li className="ml-6">Last name: {userInfo.lastName}</li>
              <li className="ml-6">Email: {userInfo.email}</li>
            </ul>
          </p>
          <p>Chatbot&apos;s creator:</p>
          <p>Bao Huynh (huynhlbg@mail.uc.edu)</p>
        </div>
      )}
    </div>
  );
};
