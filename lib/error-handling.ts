import { redirect } from "next/navigation";

export default function HandleError(error: unknown): { errors: string[] } {
  const errorObj: { errors: string[] } = { errors: [] };

  if (error instanceof Response) {
    // Handling Fetch API response errors
    console.log("Fetch API Error:", error);

    if (error.status === 401) {
      redirect("/");
    }

    error.text().then((text) => {
      try {
        const json = JSON.parse(text);
        if (json.message) {
          if (Array.isArray(json.message)) {
            errorObj.errors.push(...json.message);
          } else if (typeof json.message === "string") {
            errorObj.errors.push(json.message);
          }
        } else {
          errorObj.errors.push("An unknown server error occurred.");
        }
      } catch {
        errorObj.errors.push("Failed to parse server response.");
      }
    });
  } else if (error instanceof Error) {
    // Handling JavaScript errors
    console.log("Unexpected Error:", error);
    errorObj.errors.push(error.message || "An unexpected error occurred.");
  } else {
    // Handling unknown errors
    console.log("Unknown Error Type:", error);
    errorObj.errors.push("Something went wrong. Please contact support.");
  }

  return errorObj;
}
