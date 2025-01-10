"use server"

import { SubmitType } from "@/lib/constants";
import { checkIfUserExist, createLoan, createNewLoanForClient, createPayment, getClientDB, getAllClients, getActiveLoansFromClient } from "@/lib/service";
import { client, loan } from "@/types/types";
import { Payment } from "@prisma/client";
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
    client_id: 0,
    balance: amount
  }

  let client_id = 0;

  if(existingClient === null) {
    client_id = await createLoan(client, loan);
  } else {
    loan.client_id = existingClient.client_id;
    const data = await createNewLoanForClient(loan);
    if(data.client_id != null) {
      client_id = data.client_id;
    }
  }

  const cookieStore = cookies();
  (await cookieStore).set("clientId", client_id.toString());

  redirect("/client-profile");
}

export async function formControl(prevState: unknown, formData: FormData) {
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

  if(errors.length > 0) {
    return { errors };
  }

  if(type == SubmitType.loan) {
    const loan:loan = {
      loan_id: 0,
      amount: amount,
      balance: amount,
      purpose: remarks,
      created_at: date,
      closed_at: "",
      status: 1,
      client_id: client_id
    }
    await createNewLoanForClient(loan);
    redirect('/client-profile');
  } else if(type == SubmitType.payment && loan_id) {
    const payment:Payment = {
      amount: amount,
      created_at: new Date(date),
      remarks: remarks,
      client_id: client_id,
      loan_id: +loan_id,
      payment_id: 0
    }
    console.log(payment);
    await createPayment(payment);
    redirect(`/client-profile/${loan_id}`);
  } else {
    const payment:Payment = {
      amount: amount,
      created_at: new Date(date),
      remarks: remarks,
      client_id: client_id,
      loan_id: 0,
      payment_id: 0
    }
    generalPayment(payment);
    redirect(`/client-profile`);
  }
}

async function generalPayment(payment: Payment) {
  const loans = await getActiveLoansFromClient(payment.client_id);
  loans.sort( (loan_a, loan_b) => loan_a.created_at.getTime() - loan_b.created_at.getTime() );
  let amount = payment.amount;
  let newPayment: Payment = {...payment};

  loans.every( (loan) => {
    
    if(amount > loan.balance) {
      newPayment = {...payment, loan_id: loan.loan_id, amount: loan.balance}
    } else {
      newPayment = {...payment, loan_id: loan.loan_id, amount: amount}
    }

    console.log(`${amount} - ${loan.balance}`);
    amount = amount - loan.balance;
    console.log(amount);
    createPayment(newPayment);
    console.log(amount > 0)
    return amount > 0


  })

  // loans.forEach( async loan => {
  //   const newPayment: Payment = {...payment, loan_id: loan.loan_id}
  //   if(newPayment.amount >= loan.balance) {
  //     await createPayment(newPayment);
  //     payment.amount = payment.amount - loan.balance;
  //   } else {
  //     return;
  //   }
    
  // })

}

export async function getClient(id:number) {
  const client = (await getClientDB(id)) as client;
  return client;
}

export async function GetClients() {
  const clients =  (await getAllClients()) as unknown as client[];
  
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