"use server"

import { checkIfUserExist, createLoan, createNewLoanForClient, getClientDB, getUsers } from "@/lib/loans";
import { client, loan } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function CreateLoan(prevState: unknown, formData: FormData) {

  const firstName = formData.get("first-name") as string;
  const lastname = formData.get("last-name") as string;
  const amount = formData.get("amount") as unknown as number;
  const purpose = formData.get("purpose") as string;

  const existingClient = await checkIfUserExist(firstName, lastname);
  const errors: string[] = [];

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

  if(errors.length > 0) {
    return { errors };
  }

  const client:client = {
    first_name: firstName,
    last_name: lastname,
    client_id: 0,
    middle_name: ""
  }

  const loan: loan = {
    amount: amount,
    purpose: purpose,
    loan_id: 0,
    created_at: new Date().toISOString().split("T")[0],
    closed_at: "",
    status: 1,
    client_id: 0
  }

  let client_id = 0;

  if(existingClient === undefined) {
    client_id = await createLoan(client, loan);
  } else {
    client_id = await createNewLoanForClient(existingClient["client_id"], loan);
  }

  const cookieStore = cookies();
  (await cookieStore).set("clientId", client_id.toString());

  redirect("/client-profile");
}

export async function getClient(id:number) {
  const client = (await getClientDB(id)) as client;
  return client;
}

export async function GetClients() {
  const clients =  (await getUsers()) as client[];
  
  return clients;
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