import axios from "axios";
import { redirect } from "next/navigation";

export default function HandleError(error: unknown): { errors: string[] } {
  const errorObj: { errors: string[] } = {
    errors: [],
  };
  if (axios.isAxiosError(error)) {
    console.log("AXIOS Error:", error);

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        redirect("/");
      }

      const messages = error.response.data?.message;

      if (Array.isArray(messages)) {
        errorObj.errors.push(...messages);
      } else if (typeof messages === "string") {
        errorObj.errors.push(messages);
      } else {
        errorObj.errors.push("An unknown server error occurred.");
      }
    } else if (error.request) {
      errorObj.errors.push(
        "No response received from the server. Please check your internet connection."
      );
    } else {
      errorObj.errors.push(`Request error: ${error.message}`);
    }
  } else if (error instanceof Error) {
    console.log("Unexpected Error:", error);
    errorObj.errors.push("An unexpected error occurred. Please try again.");
  } else {
    console.log("Unknown Error Type:", error);
    errorObj.errors.push("Something went wrong. Please contact support.");
  }
  return errorObj;
}
