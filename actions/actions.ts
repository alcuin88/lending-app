"use server";

import { Client } from "@/lib/interface";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function CreateLoan(prevState: unknown, formData: FormData) {
  const loanURL = "http://localhost:3333/loan/new";
  const token = (await cookies()).get("access_token")?.value as string;
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
  }

  const loan = {
    amount: amount.toString(),
    balance: amount.toString(),
    purpose,
    first_name: firstName,
    last_name: lastname,
    client_id: client_id.toString(),
  };

  try {
    const response = await fetch(loanURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams(loan).toString(),
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
  } catch (error) {
    throw new Error(`Error posting loan: ${error}`);
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
  const clientURL = "http://localhost:3333/client/create";
  try {
    const response = await fetch(clientURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        first_name: first_name,
        last_name: last_name,
        token,
      }).toString(),
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  } catch {
    throw new Error("Failed to create new client.");
  }
}

export async function getClientByName(
  first_name: string,
  last_name: string,
  token: string
): Promise<Client> {
  const clientURL = "http://localhost:3333/loan/client";
  try {
    const response = await fetch(clientURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        first_name: first_name,
        last_name: last_name,
      }).toString(),
    });
    if (!response.ok) {
      return notFound();
    }
    return (await response.json()) as Client;
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
  const url = "http://localhost:3333/client/all";
  const client: Client[] = [];
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return redirect("/");
    }
    const fetchedClient = (await response.json()) as Client[];
    client.push(...fetchedClient);
  } catch (error) {
    console.log("Error creating user:", error);
  }
  return client;
}
