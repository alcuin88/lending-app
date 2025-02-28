import { revalidatePath } from "next/cache";

export async function PostAPI<T extends object>(
  payload: T,
  url: string,
  token?: string
) {
  try {
    const formattedData = JSON.stringify(payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formattedData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export async function GetAPI(url: string, token: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
      // next: {
      //   revalidate: 3600,
      // },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while connecting to the server."
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export function Revalidate() {
  revalidatePath(`/dashboard`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/loans`);
  revalidatePath(`/client-profile`);
}
