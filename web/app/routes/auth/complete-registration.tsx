import { type LoaderFunctionArgs, redirect } from "react-router";
import { useLoaderData } from "react-router";
import { sessionStorage } from "~/services/session.server";
import { RegistrationCompletion } from "~/components/waffle/registration/registration-completion";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const pendingRegistration = session.get("pendingRegistration");

  if (!user) {
    return redirect("/auth/twitter");
  }

  if (user.isRegistered) {
    return redirect("/");
  }

  return {
    user,
    registrationData: pendingRegistration,
  };
}

export function meta() {
  return [
    { title: "Complete Registration - Waffle" },
    {
      name: "description",
      content:
        "Complete your Waffle registration by connecting your wallet and registering on-chain.",
    },
  ];
}

export default function CompleteRegistration() {
  const { user, registrationData } = useLoaderData<typeof loader>();

  const handleComplete = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegistrationCompletion
          twitterUser={user}
          registrationData={registrationData}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
