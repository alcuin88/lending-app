"use server";

import { GetAPI, PostAPI, Revalidate } from "@/api";
import { SubmitType } from "@/lib/constants";
import HandleError from "@/lib/error-handling";
import { Client, Loan, Payment } from "@/lib/interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function getToken(): Promise<string> {
  return (await cookies()).get("access_token")?.value ?? "";
}

export async function formControl(prevState: unknown, formData: FormData) {
  const token = await getToken();
  const date = formData.get("date")?.toString().trim();
  const amount = Number(formData.get("amount"));
  const remarks = formData.get("remarks")?.toString().trim();
  const type = formData.get("formType") as unknown as SubmitType;
  const client_id = Number(formData.get("client_id"));
  const loan_id = formData.get("loan_id")
    ? Number(formData.get("loan_id"))
    : null;

  const errors: string[] = [];

  if (!date) errors.push("Date is required.");
  if (!amount || amount <= 0) errors.push("Amount should be non-zero.");
  if (!remarks) errors.push("Remarks are required.");

  if (errors.length > 0) {
    return { errors };
  }

  if (type == SubmitType.loan) {
    const loan = {
      amount: amount.toString(),
      balance: amount.toString(),
      purpose: remarks,
      client_id: client_id.toString(),
    };

    const loanResponse = await postLoan(loan, token);
    if (loanResponse?.errors) return { errors: loanResponse.errors };

    redirect("/client-profile");
  } else {
    const parsedDate = isNaN(Date.parse(date as string))
      ? new Date()
      : new Date(date as string);
    const payment: Payment = {
      client_id: client_id,
      amount: amount,
      created_at: parsedDate,
      remarks: remarks as string,
      loan_id: loan_id ? +loan_id : 0,
      payment_id: 0,
      status: "Active",
    };
    const paymentResponse = await postPayment(payment, token);
    if (paymentResponse?.errors) return { errors: paymentResponse.errors };

    redirect(loan_id ? `/client-profile/${loan_id}` : `/client-profile`);
  }
}

async function postLoan(payload: object, token: string) {
  const url = `${API_URL}/loan/new`;

  const response = await PostAPI<object>(payload, url, token);

  return response.success ? null : { errors: [response.message] };
}

async function postPayment(payload: Payment, token: string) {
  const url = `${API_URL}/payment/new`;

  const response = await PostAPI<Payment>(payload, url, token);

  return response.success ? null : { errors: [response.message] };
}

export async function getLoanById(
  loan_id: number,
  token: string
): Promise<Loan | null> {
  const url = `${API_URL}/loan/${loan_id}`;
  const response = await GetAPI(url, token);

  return response.success ? response.data : null;
}

export async function getLoanPayments(
  loan_id: number,
  token: string
): Promise<Payment[]> {
  const url = `${API_URL}/payment/${loan_id}`;

  const response = await GetAPI(url, token);

  return response.success ? response.data : null;
}

export async function getClientById(
  client_id: number,
  token: string
): Promise<Client | null> {
  const url = `${API_URL}/client/${client_id}`;
  const response = await GetAPI(url, token);

  return response.success ? response.data : null;
}

export async function deleteLoan(loan_id: number) {
  const token = (await cookies()).get("access_token")?.value as string;
  const url = `${API_URL}/loan/delete/${loan_id}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": "0",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while connecting to the server."
      );
    }
    Revalidate();
  } catch (error) {
    return HandleError(error);
  }
  redirect("/client-profile");
}
