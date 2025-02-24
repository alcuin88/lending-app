import axios from "axios";
import { redirect } from "next/navigation";

export default function ErrorHandling(error: unknown) {
  const errorObj: { error: string[] } = {
    error: [],
  };
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      console.log(error.response);
      if (status === 401) {
        redirect("/");
      }
      error.response.data?.message.forEach((message: string) => {
        errorObj.error.push(message);
      });
    } else if (error.request) {
      errorObj.error.push("No response received from server.");
    } else {
      errorObj.error.push(`Request error: ${error.message}`);
    }
  } else {
    errorObj.error.push(`Unexpected error: ${error}`);
  }
  return errorObj;
}
