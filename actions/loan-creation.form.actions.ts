"use server";

import { Client } from "@/lib/interface";
import axios, { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function CreateLoan(prevState: unknown, formData: FormData) {
  const loanURL = `${API_URL}/loan/new`;
  const token = formData.get("token") as string;
  const firstName = formData.get("first-name") as string;
  const lastname = formData.get("last-name") as string;
  const amount = formData.get("amount") as unknown as number;
  const purpose = formData.get("purpose") as string;
  const errors: string[] = [];

  let client_id = 0;

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required.");
  }

  if (!lastname || lastname.trim().length === 0) {
    errors.push("Last name is required.");
  }

  if (!amount || amount === 0) {
    errors.push("Amount should be non zero.");
  }

  if (!purpose || purpose.trim().length === 0) {
    errors.push("Content is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const client = await getClientByName(firstName, lastname, token);

  if (!client) {
    client_id = await createClient(firstName, lastname, token);
  } else {
    client_id = client.client_id;
  }

  console.log(client_id);

  const loan = {
    amount: amount.toString(),
    balance: amount.toString(),
    purpose,
    client_id: client_id.toString(),
  };

  try {
    const res = await axios.post(
      loanURL,
      new URLSearchParams(loan).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== HttpStatusCode.Ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Request failed:", error);
    throw new Error(`Error: ${error}`);
  }

  const cookieStore = cookies();
  (await cookieStore).set("clientId", client_id.toString());

  redirect("/client-profile");
}

async function createClient(
  first_name: string,
  last_name: string,
  token: string
) {
  const clientURL = `${API_URL}/client/create`;
  try {
    const res = await axios.post(
      clientURL,
      new URLSearchParams({
        first_name: first_name,
        last_name: last_name,
        token,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.client_id;
  } catch {
    throw new Error("Failed to create new client.");
  }
}

export async function getClientByName(
  first_name: string,
  last_name: string,
  token: string
) {
  const clientURL = `${API_URL}/client`;
  console.log(`GET CLIENT NAME: ${first_name} ${last_name} ${token}`);
  try {
    const response = await axios.post(
      clientURL,
      new URLSearchParams({
        first_name,
        last_name,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.status) {
      throw new Error(response.status.toString());
    }
    return response.data;
  } catch (error) {
    throw new Error(`Error posting loan: ${error}`);
  }
}

export async function setClientIdFromSearch(id: number) {
  const cookieStore = cookies();
  (await cookieStore).set("clientId", id.toString());
}

export async function getClientIdFromSearch() {
  const cookieStore = cookies();
  const value = (await cookieStore).get("clientId")?.value || 0;

  return +value;
}

export async function fetchClients(token: string): Promise<Client[]> {
  const url = `${API_URL}/client/all`;
  const client: Client[] = [];
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== HttpStatusCode.Ok) {
      return redirect("/");
    }
    const fetchedClient = response.data as Client[];
    client.push(...fetchedClient);
  } catch (error) {
    console.log("Error creating user:", error);
  }
  return client;
}
