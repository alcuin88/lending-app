"use server";

import { GetAPI, PostAPI, Revalidate } from "@/api";
import { Client } from "@/lib/interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function CreateLoan(prevState: unknown, formData: FormData) {
  const token = formData.get("token") as string;
  const firstName = (formData.get("first-name") as string) ?? "";
  const lastName = (formData.get("last-name") as string) ?? "";
  const amount = Number(formData.get("amount") ?? 0);
  const purpose = (formData.get("purpose") as string) ?? "";
  const errors: string[] = [];

  let client_id = 0;

  if (!firstName.trim()) {
    errors.push("First name is required.");
  }

  if (!lastName.trim()) {
    errors.push("Last name is required.");
  }

  if (amount <= 0 || isNaN(amount)) {
    errors.push("Amount should be greater than zero.");
  }

  if (!purpose.trim()) {
    errors.push("Purpose is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const client = await getClientByName(firstName, lastName, token);

  if (client && "errors" in client) {
    console.log(...client.errors);
    return { errors: client.errors };
  }

  if (!client) {
    const createdClient = await createClient(firstName, lastName, token);

    if (typeof createdClient === "object" && "errors" in createdClient) {
      return { errors: createdClient.errors };
    }

    client_id = createdClient;
  } else {
    client_id = client.client_id;
  }

  const loan = {
    amount: amount.toString(),
    balance: amount.toString(),
    purpose,
    client_id: client_id.toString(),
  };

  const createdLaon = await postLoan(loan, token);

  if ("errors" in createdLaon) {
    return { errors: createdLaon.errors };
  }
  Revalidate();

  const cookieStore = cookies();
  (await cookieStore).set("clientId", client_id.toString());
  redirect("/client-profile");
}

async function postLoan(loan: object, token: string) {
  const loanURL = `${API_URL}/loan/new`;
  const res = await PostAPI(loan, loanURL, token);
  console.log(res);
  if (!res.success) {
    return {
      errors: res.errors ?? ["An unknown error occurred."],
    };
  }

  return res.data;
}

async function createClient(
  first_name: string,
  last_name: string,
  token: string
): Promise<number | { errors: string[] }> {
  const clientURL = `${API_URL}/client/create`;
  const payload = {
    first_name,
    last_name,
  };

  const client = await PostAPI(payload, clientURL, token);

  if (!client.success) {
    return {
      errors: client.errors ?? ["An unknown error occurred."],
    };
  }

  const { client_id } = client.data;

  console.log(client_id);

  return client_id;
}

export async function getClientByName(
  first_name: string,
  last_name: string,
  token: string
): Promise<Client | { errors: string[] } | undefined> {
  const clientURL = `${API_URL}/client`;

  const response = await PostAPI({ first_name, last_name }, clientURL, token);

  if (!response.success || !response.data) {
    return {
      errors: response.errors ?? ["An unknown error occurred."],
    };
  }

  if (!response.data.client) {
    return undefined;
  }

  return response.data.client;
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

  const clients = await GetAPI(url, token);

  if (!clients.success) {
    return [];
  }

  return clients.data;
}
