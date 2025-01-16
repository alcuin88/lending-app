import { prisma } from "./prisma";
import { Client, Loan, Payment } from "@prisma/client";

export async function getAllClients(userId: number): Promise<Client[]>{
  if (typeof userId !== "number" || userId <= 0) {
    throw new Error("Invalid user ID provided.");
  }

  try {
    return await prisma.client.findMany({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients.");
  }
}

export async function getClient(id: number): Promise<Client | null> {
  if (typeof id !== "number") {
    throw new Error("Invalid client ID provided.");
  }

  try {
    const client = await prisma.client.findFirst({
      where: {
        client_id: id,
      },
    });

    if (!client) {
      console.warn(`No client found with ID: ${id}`);
    }

    return client; // This will return null if no client is found
  } catch (err) {
    console.error(`Error fetching client with ID ${id}:`, err);
    throw new Error("An error occurred while fetching the client.");
  }
}

export async function checkIfUserExist(firstName: string, lastName: string) {
  try{
    const client = await prisma.client.findFirst({
      select: {
        client_id: true
      },
      where: {
        first_name: firstName,
        last_name: lastName,
      }
    })

    return client;
  } catch(err) {
    console.error("Error fetching client: ", err);
    throw new Error("Failed to fetch client.");
  }
  
}

export async function getLoanList(user_id: number) {
  try {
    const clients = await prisma.client.findMany({
      where: {
        user_id: user_id
      },
      include: {
        loans: true,
      },
      orderBy: {
        last_name: "asc",
      },
    });

    return clients.map((client) => {
      const totalLoans = client.loans.reduce((sum, loan) => sum + loan.amount, 0);
      const totalPayments = client.loans.reduce((sum, loan) => sum + (loan.amount - loan.balance), 0);

      return {
        client_id: client.client_id,
        last_name: client.last_name,
        first_name: client.first_name,
        totalLoans,
        totalPayments,
      };
    });
  } catch (error) {
    console.error("Error fetching loan list:", error);
    throw new Error("Failed to fetch loan list.");
  }
}

export async function getLoan(id: number) {
  console.log(`id is number: ${typeof id}`)
  console.log(`id: ${id}`)
  if (typeof id !== "number" || id <= 0) {
    throw new Error("Invalid loan ID provided.");
  }

  const loan = await prisma.loan.findFirst({ where: { loan_id: +id } });

  if (!loan) {
    throw new Error(`Loan with ID ${id} not found.`);
  }

  return loan;
}

export async function findRecords<T>(model:  { findMany: (args: { where: object }) => Promise<T[]> }, filters: object): Promise<T[]> {
  try {
    return await model.findMany({ where: filters });
  } catch (error) {
    console.error(`Error fetching records from ${model}:`, error);
    throw new Error("Failed to fetch records.");
  }
}

export async function createLoan(client: Client, loan: Loan) {

  try{
    const result = await prisma.$transaction(async (prisma) => {
      const newClient = await prisma.client.create({
        data: {
          user_id: client.user_id,
          first_name: client.first_name,
          last_name: client.last_name,
          middle_name: client.middle_name,
        },
      });

      const newLoan = await prisma.loan.create({
        data: {
          user_id: loan.user_id,
          client_id: newClient.client_id,
          amount: loan.amount,
          balance: loan.balance,
          purpose: loan.purpose,
        },
      });

      return { newClient, newLoan };
    });

    return result;
  } catch(error) {
    console.error("Error creating loan with client:", error);
    throw new Error("Failed to create loan with client.");
  }
}

export async function createNewLoanForClient(loan: Loan) {
  try {
    return await prisma.loan.create({
      data: {
        user_id: +loan.user_id,
        amount: +loan.amount,
        balance: +loan.balance,
        purpose: loan.purpose,
        client_id: +loan.client_id,
      },
    });
  } catch (error) {
    console.error(`Error creating loan for client_id ${loan.client_id}:`, error);
    throw new Error("Failed to create loan.");
  }
}

export async function createPayment(payment: Payment) {
 
  try {
    await prisma.payment.create({
      data: {
        amount: +payment.amount,
        remarks: payment.remarks,
        created_at: payment.created_at,
        client_id: +payment.client_id,
        loan_id: +payment.loan_id,
      }
    });

  } catch (err) {
    console.log("Error creating payment:", err);
  }
}