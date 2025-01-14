import { loan_list } from "@/types/types";
import { prisma } from "./prisma";
import { Client, Loan, Payment } from "@prisma/client";

export async function getAllClients(){
  try {
    return await prisma.client.findMany();
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients.");
  }
}

export async function getClientDB(id: number) {

  try{
    const client = await prisma.client.findFirst({
      where: {
        client_id: +id
      }
    })

    return client;
  } catch(err) {
    console.error("Error fetching client: ", err);
    throw new Error("Failed to fetch client.");
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

export async function getLoanList() {
  try {
    const clients = await prisma.client.findMany({
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
      } as loan_list;
    });
  } catch (error) {
    console.error("Error fetching loan list:", error);
    throw new Error("Failed to fetch loan list.");
  }
}

export async function getLoans() {
  try {
    const loans = await prisma.loan.findMany();

    return loans;
  } catch(err) {
    console.error("Error fetching loans: ", err);
    throw new Error("Failed to fetch loans.");
  }
}

export async function getLoan(id: number) {
  try {
    const loan = await prisma.loan.findFirst({
      where: {
        loan_id: +id
      }
    });
    return loan;
  } catch(err) {
    console.error("Error fetching loan: ", err);
    throw new Error("Failed to fetch loan.");
  }
}

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany();
    return payments;
  } catch(err) {
    console.error("Error fetching payments: ", err);
    throw new Error("Failed to fetch payments.");
  }
}

export async function getPaymentsFromClient(id: number) {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        client_id: +id
      }
    })
    return payments;
  } catch(err) {
    console.error("Error fetching payments: ", err);
    throw new Error("Failed to fetch payments.");
  }
}

export async function getPaymentsForLoan(id: number) {
  try {
    const loanPayments = await prisma.payment.findMany({
      where: {
        loan_id: +id
      }
    })

    return loanPayments;
  } catch(err) {
    console.error("Error fetching payments: ", err);
    throw new Error("Failed to fetch loan payments.");
  }
}

export async function getActiveLoansFromClient(id: number) {
  try {
    const clientActiveLoans = await prisma.loan.findMany({
      where: {
        status: 1,
        client_id: +id,
      }
    })
    
    return clientActiveLoans;
  } catch(err) {
    console.error("Error fetching active loans for client id:", id);
    console.error("Error message :", err);
    throw new Error("Failed to fetch active loans.");
  }
}

export async function createLoan(client: Client, loan: Loan) {

  try{
    const newLoan = await prisma.client.create({
      data: {
        user_id: 0,
        first_name: client.first_name,
        last_name: client.last_name,
        middle_name: client.middle_name,
        loans: {
          create: {
            user_id: 0,
            amount: +loan.amount,
            balance: +loan.balance,
            purpose: loan.purpose,
          }
        }
      }
    })

    return newLoan.client_id;
  } catch(error) {
    console.error("Error creating new loan:", error);
    throw new Error("Failed to create new loan.");
  }
}

export async function createNewLoanForClient(loan: Loan) {
  try {
    return await prisma.loan.create({
      data: {
        user_id: 0,
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