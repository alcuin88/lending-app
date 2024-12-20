export interface client {
  client_id: number,
  first_name: string,
  last_name: string,
  middle_name: string
}

export interface loan {
  loan_id: number,
  amount: number,
  purpose: string,
  created_at: string,
  closed_at: string,
  status: number,
  client_id: number
}

export interface payment {
  payment_id: number,
  amount: number,
  created_at: string,
  client_id: number,
  loan_id: number
}