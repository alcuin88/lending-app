"use server";

import { SubmitType } from "@/lib/constants";
import { Payment } from "@/lib/interface";
import axios, { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    try {
      const url = "http://localhost:3333/loan/new";
      const response = await axios.post(
        url,
        new URLSearchParams(loan).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`Error posting loan: ${error}`);
    }

    redirect("/client-profile");
  } else if (type == SubmitType.payment && loan_id) {
    const payment: Payment = {
      amount: amount,
      created_at: new Date(date),
      remarks: remarks,
      loan_id: +loan_id,
      payment_id: 0,
      client_id: client_id,
    };
    await postPayment(payment, token);
    redirect(`/client-profile/${loan_id}`);
  } else {
    const payment: Payment = {
      client_id: client_id,
      amount: amount,
      created_at: new Date(date),
      remarks: remarks,
      loan_id: 0,
      payment_id: 0,
    };
    await postPayment(payment, token);
    redirect(`/client-profile`);
  }
}

async function postPayment(payment: Payment, token: string) {
  const url = "http://localhost:3333/payment/new";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        amount: payment.amount.toString(),
        remarks: payment.remarks,
        loan_id: payment.loan_id.toString(),
        client_id: payment.client_id.toString(),
        created_at: payment.created_at.toISOString(),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== HttpStatusCode.Created) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.data;
  } catch {
    throw new Error("Failed to create new client.");
  }
}

export async function getLoanById(loan_id: number, token: string) {
  const url = "http://localhost:3333/loan/id";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        loan_id: loan_id.toString(),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.data;
  } catch {
    throw new Error(`Failed to fetch Loan with loan_id: ${loan_id}`);
  }
}

export async function getPaymentById(
  loan_id: number,
  token: string
): Promise<Payment[]> {
  const url = "http://localhost:3333/payment/id";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        loan_id: loan_id.toString(),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Payment.");
  }
}

export async function getClientById(client_id: number, token: string) {
  const url = "http://localhost:3333/client/id";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        client_id: client_id.toString(),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.data;
  } catch {
    throw new Error(`Failed to fetch Client with client_id: ${client_id}`);
  }
}
