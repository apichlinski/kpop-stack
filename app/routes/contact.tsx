import React from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
//import { verifyLogin } from "~/models/user.server";
//import { createUserSession, getUserId } from "~/session.server";
//import { validateEmail } from "~/utils";

export const meta: MetaFunction = () => {
  return {
    title: "Contact",
  };
};

interface ActionData {
  message?: string;
  status: {
    message?: string;
  }
  errors: {
    email?: string;
    subject?: string;
    message?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const redirectTo = formData.get("redirectTo");

  if (typeof subject !== "string") {
    return json(
      { errors: { subject: "Valid subject is required." } },
      { status: 400 }
    );
  }

  if (subject.length < 6) {
    return json(
      { errors: { subject: "Subject is too short" } },
      { status: 400 }
    );
  }

  if (message.length < 55) {
    return json(
      { errors: { message: "Message is too short" } },
      { status: 400 }
    );
  }
  
  return json(
    { message: "Message has been sent." },
    { status: 200 }
  );
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const subjectRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef?.current?.focus();
    }

    if (actionData?.errors?.subject) {
      subjectRef?.current?.focus();
    }

    if (actionData?.errors?.message) {
      messageRef?.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
      {actionData?.message && (
                <span className="pt-1 text-green-700" id="subject-error">
                  {actionData?.message}
                </span>
              )}
        <Form method="post" className="space-y-6" noValidate>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              <span className="block text-gray-700">Email Address</span>
              {actionData?.errors?.email && (
                <span className="block pt-1 text-red-700" id="email-error">
                  {actionData?.errors?.email}
                </span>
              )}
            </label>
            <input
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              autoComplete="email"
              type="email"
              name="email"
              id="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              ref={emailRef}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              <span className="block text-gray-700">Subject</span>
              <span className="block font-light text-gray-700">
                Must have at least 6 characters.
              </span>
              {actionData?.errors?.subject && (
                <span className="pt-1 text-red-700" id="subject-error">
                  {actionData?.errors?.subject}
                </span>
              )}
            </label>
            <input
              id="subject"
              type="subject"
              name="subject"
              autoComplete=""
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              aria-invalid={actionData?.errors?.subject ? true : undefined}
              aria-describedby="subject-error"
              ref={subjectRef}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="message">
              <span className="block text-gray-700">Message</span>
              <span className="block font-light text-gray-700">
                Must have at least 55 characters.
              </span>
              {actionData?.errors?.message && (
                <span className="pt-1 text-red-700" id="message-error">
                  {actionData?.errors?.message}
                </span>
              )}
            </label>
            <textarea 
              id="message"
              name="message"
              autoComplete=""
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              ref={messageRef}>
              </textarea>
          </div>
          <button
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            type="submit"
          >
            Send
          </button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </Form>
      </div>
    </div>
  );
}
