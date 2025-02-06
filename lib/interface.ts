export interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  user_id: number;
  loans: Loan[];
  payments: Payment[];
}

export interface Loan {
  loan_id: number;
  amount: number;
  balance: number;
  purpose: string;
  created_at: Date;
  closed_at?: Date;
  status: string;
  user_id: number;
  client_id: number;
}

export interface Payment {
  payment_id: number;
  amount: number;
  remarks: string;
  created_at: Date;
  loan_id: number;
  client_id: number;
}

export interface LoanList {
  client_id: number;
  last_name: string;
  first_name: string;
  totalLoans: number;
  totalPayments: number;
}
