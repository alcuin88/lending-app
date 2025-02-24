"use server";

import { GetAPI, PostAPI } from "@/api";
import { SubmitType } from "@/lib/constants";
import { Client, Loan, Payment } from "@/lib/interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function formControl(prevState: unknown, formData: FormData) {
  const token = (await cookies()).get("access_token")?.value as string;
  const date = formData.get("date") as string;
  const amount = formData.get("amount") as unknown as number;
  const remarks = formData.get("remarks") as string;
  const type = formData.get("formType") as unknown as SubmitType;
  const client_id = formData.get("client_id") as unknown as number;
  const loan_id = formData.get("loan_id");

  const errors: string[] = [];

  if (!date || date.trim().length === 0) {
    errors.push("Date is required.");
  }

  if (!amount || amount === 0) {
    errors.push("Amount should be non zero.");
  }

  if (!remarks || remarks.trim().length === 0) {
    errors.push("Content is required.");
  }

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

    if (loanResponse?.errors) {
      return {
        errors: loanResponse.errors.error,
      };
    }

    redirect("/client-profile");
  } else {
    const payment: Payment = {
      client_id: client_id,
      amount: amount,
      created_at: new Date(date),
      remarks: remarks,
      loan_id: loan_id ? +loan_id : 0,
      payment_id: 0,
    };
    const paymentResponse = await postPayment(payment, token);
    if (paymentResponse?.errors) {
      return {
        errors: [...paymentResponse?.errors.error],
      };
    }
    redirect(loan_id ? `/client-profile/${loan_id}` : `/client-profile`);
  }
}

async function postLoan(payload: object, token: string) {
  const url = `${API_URL}/loan/new`;

  const loan = await PostAPI<object>(payload, url, token);

  if (!loan.success) {
    return {
      errors: {
        error: [loan.message],
      },
    };
  }
}

async function postPayment(payload: Payment, token: string) {
  const url = `${API_URL}/payment/new`;

  const payment = await PostAPI<Payment>(payload, url, token);

  if (!payment.success) {
    return {
      errors: {
        error: [payment.message],
      },
    };
  }
}

export async function getLoanById(
  loan_id: number,
  token: string
): Promise<Loan | null> {
  const url = `${API_URL}/loan/${loan_id}`;
  const loan = await GetAPI(url, token);

  if (!loan.success) {
    return null;
  }

  return loan.data;
}

export async function getLoanPayments(
  loan_id: number,
  token: string
): Promise<Payment[]> {
  const url = `${API_URL}/payment/${loan_id}`;

  const payment = await GetAPI(url, token);

  if (!payment.success) {
    return [];
  }

  return payment.data;
}

export async function getClientById(
  client_id: number,
  token: string
): Promise<Client | null> {
  const url = `${API_URL}/client/${client_id}`;
  const client = await GetAPI(url, token);

  if (!client.success) {
    return null;
  }

  return client.data as Client;
}
