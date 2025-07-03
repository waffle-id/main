import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    return await authenticator.authenticate("twitter", request);
  } catch (error) {
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("twitter", request);
  } catch (error) {
    throw error;
  }
}
