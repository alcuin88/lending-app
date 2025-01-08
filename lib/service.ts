import { client, loan, payment } from "@/types/types";
import prisma from "./prisma";


export async function getUsers(){
  try {
    const users = await prisma.client.findMany();
    return users;
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    await prisma.$disconnect();
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
  }  finally {
    await prisma.$disconnect();
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
  }  finally {
    await prisma.$disconnect();
  }
  
}

export async function getLoanList() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        loans: {
          select: {
            amount: true,
          }
        },
        payments: {
          select: {
            amount: true
          }
        }
      },
      orderBy: {
        last_name: 'asc'
      }
    })

    const result = clients.map( (client) => {
      const total_loans = client.loans.reduce((sum, loan) => sum + loan.amount, 0);
      const total_payments = client.payments.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        client_id: client.client_id,
        last_name: client.last_name,
        first_name: client.first_name,
        total_loans,
        total_payments,
      }
    })

    return result;
  } catch (err) {
    console.error("Error fetching loan list: ", err);
    throw new Error("Failed to fetch loan list.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getLoans() {
  try {
    const loans = await prisma.loan.findMany();
    return loans;
  } catch(err) {
    console.error("Error fetching loans: ", err);
    throw new Error("Failed to fetch loans.");
  }  finally {
    await prisma.$disconnect();
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
  }  finally {
    await prisma.$disconnect();
  }
}

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany();
    return payments;
  } catch(err) {
    console.error("Error fetching payments: ", err.stack);
    throw new Error("Failed to fetch payments.");
  }  finally {
    await prisma.$disconnect();
  }
}

export async function getPaymentsForLoan(id: number) {
  try {
    const loanPayments = await prisma.payment.findMany({
      where: {
        loan_id: +id
      }
    })

    return loanPayments as unknown as payment[];
  } catch(err) {
    console.error("Error fetching payments: ", err);
    throw new Error("Failed to fetch loan payments.");
  }  finally {
    await prisma.$disconnect();
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
  }  finally {
    await prisma.$disconnect();
  }
}

export async function createLoan(client: client, loan: loan) {
  console.log(client)
  console.log(loan)
  try{
    const newLoan = await prisma.client.create({
      data: {
        first_name: client.first_name,
        last_name: client.last_name,
        middle_name: client.middle_name,
        loans: {
          create: {
            amount: +loan.amount,
            balance: +loan.balance,
            purpose: loan.purpose,
          }
        }
      }
    })
    console.log(newLoan);
    return newLoan.client_id;
  } catch(error) {
    console.error("Error creating new loan:", error.stack);
    throw new Error("Failed to create new loan.");
  }  finally {
    await prisma.$disconnect();
  }
}

export async function createNewLoanForClient(loan: loan) {
  const date = new Date(loan.created_at);
  try {
    const newClientLoan = await prisma.loan.create({
      data: {
        amount: +loan.amount,
        balance: +loan.balance,
        purpose: loan.purpose,
        created_at: date,
        client_id: +loan.client_id
      }
    })

    console.log(newClientLoan);

    if(newClientLoan.client_id != null){
      return newClientLoan.client_id;
    }
    return 0;
  } catch (error) {
    console.error("Error creating new loan:", error.stack);
    throw new Error("Failed to create new loan.");
  }  finally {
    await prisma.$disconnect();
  }
}

export async function createpayment(payment: payment) {
  const date = new Date(payment.created_at);
  try {
    await prisma.payment.create({
      data: {
        amount: +payment.amount,
        remarks: payment.remarks,
        created_at: date,
        client_id: +payment.client_id,
        loan_id: +payment.loan_id,
      }
    });

  } catch (err) {
    console.log("Error creating payment:", err.stack);
  } finally {
    await prisma.$disconnect();
  }
}