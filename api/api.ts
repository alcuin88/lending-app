import axios from "axios";

export async function PostAPI<T extends object>(
  payload: T | URLSearchParams,
  url: string,
  token?: string
) {
  try {
    const formattedData =
      payload instanceof URLSearchParams
        ? payload
        : new URLSearchParams(
            Object.entries(payload).reduce((acc, [key, value]) => {
              acc[key] =
                value instanceof Date ? value.toISOString() : String(value);
              return acc;
            }, {} as Record<string, string>)
          ).toString();

    const response = await axios.post(url, formattedData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while connecting to the server.",
      };
    } else {
      return {
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }
}

export async function GetAPI(url: string, token: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 3600,
      },
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

// export async function GetAPI(url: string, token: string) {
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return {
//         success: false,
//         message:
//           error.response?.data?.message ||
//           "An error occurred while connecting to the server.",
//       };
//     } else {
//       return {
//         success: false,
//         message: "An unexpected error occurred.",
//       };
//     }
//   }
// }
