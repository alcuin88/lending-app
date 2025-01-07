const sql = require("better-sqlite3");
import { client, loan, payment } from "@/types/types";
import { DUMMY_LOANS, DUMMY_PAYMENTS } from "../public/dummy_data";
const db = sql("loans.db");

async function initDb() {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS clients (
      client_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      first_name TEXT, 
      last_name TEXT,
      middle_name TEXT
    )`
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS loans (
      loan_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      amount INTEGER NOT NULL,
      balance INTEGER NOT NULL,
      purpose TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      closed_at TEXT,
      status INTEGER DEFAULT 1,
      client_id INTEGER,
      FOREIGN KEY(client_id) REFERENCES clients(client_id) ON DELETE CASCADE
    )`
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      amount INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      remarks TEXT,
      client_id INTEGER,
      loan_id INTEGER,
      FOREIGN KEY(client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
      FOREIGN KEY(loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
    )`
  ).run();
  db.prepare(
    `
    CREATE TRIGGER IF NOT EXISTS update_loan
      AFTER INSERT ON payments
      FOR EACH ROW
      BEGIN
        UPDATE loans
        SET balance = (balance - NEW.amount),
            status = CASE 
              WHEN balance - NEW.amount = 0 THEN 0 
              ELSE 1
            END
        WHERE loan_id = NEW.loan_id;
      END;
    `
  ).run();

  // Creating two dummy clients if they don't exist already
  const stmt = db.prepare("SELECT COUNT(*) AS count FROM clients");
  const row = stmt.get() as { count: number };

  if (row.count === 0) {
    db.exec(`
    INSERT INTO clients (first_name, last_name, middle_name)
    VALUES ('Alcuin Allan', 'Andrade', 'Enclona')
  `);

    db.exec(`
    INSERT INTO clients (first_name, last_name, middle_name)
    VALUES ('Chenmarie Grace', 'Andrade', 'Collarga')
  `);

    const insertStmt = db.prepare(`
    INSERT INTO loans VALUES (
      null,
      @amount,
      @balance,
      @purpose,
      @created_at,
      @closed_at,
      @status,
      @client_id
    )
  `);

    for (const loan of DUMMY_LOANS) {
      insertStmt.run(loan);
    }

    const insertPayment = db.prepare(`
    INSERT INTO payments VALUES (
      null,
      @amount,
      @created_at,
      @remarks,
      @client_id,
      @loan_id
    )
  `);

    for (const payment of DUMMY_PAYMENTS) {
      insertPayment.run(payment);
    }
  }
}

initDb();

export async function getUsers() {
  const stmt = db.prepare(`
      SELECT * FROM clients
    `);

  return await stmt.all();
}

export async function getClientDB(id: number) {
  const stmt = db.prepare(
    `
      SELECT *
      FROM clients
      WHERE
        client_id = ?
    `
  );
  return await stmt.get(id);
}

export async function checkIfUserExist(firstName: string, lastName: string) {
  const stmt = db.prepare(
    `
      SELECT client_id
      FROM clients
      WHERE
        first_name = ?
      AND
        last_name = ?
    `
  );
  return await stmt.get(firstName, lastName);
}

export async function getLoanList() {
  const stmt = db.prepare(
    `
      SELECT 
        clients.client_id,
        clients.last_name, 
        clients.first_name, 
        COALESCE(
          (SELECT SUM(loans.amount)
           FROM loans
           WHERE loans.client_id = clients.client_id), 0
        ) AS total_loan,
        COALESCE(
          (SELECT SUM(payments.amount)
           FROM payments
           WHERE payments.client_id = clients.client_id), 0
        ) AS total_payments
      FROM clients
      ORDER BY clients.last_name ASC;
    `
  );

  return await stmt.all();
}

export async function getLoans() {
  const stmt = db.prepare(`
      SELECT * FROM loans
    `);

  return await stmt.all();
}

export async function getLoan(id: number) {
  const stmt = db.prepare(`
      SELECT * FROM loans
      WHERE loan_id = ?
    `);

  return await stmt.get(id) as loan;
}

export async function getPayments() {
  const stmt = db.prepare(`
      SELECT * FROM payments
    `);

  return await stmt.all();
}

export async function getPaymentsForLoan(id: number) {
  const stmt = db.prepare(`
      SELECT * FROM payments
      WHERE loan_id = ?
    `);

  return await stmt.all(id) as payment[];
}

export async function getActiveLoansFromClient(id: number) {
  const stmt = db.prepare(
    `
      SELECT * FROM loans
      WHERE status = 1
      AND client_id = ?
    `
  );
  return await stmt.all(id);
}

export async function createLoan(client: client, loan: loan) {
  const stmt = db.prepare(
    `
      INSERT INTO clients (first_name, last_name, middle_name)
      VALUES (?, ?, ?)
    `
  );

  const insertResult = stmt.run(
    client.first_name,
    client.last_name,
    client.middle_name);

  const clientId = insertResult.lastInsertRowid;

  const loanStmt = db.prepare(
    `
        INSERT INTO loans (amount, purpose, created_at, client_id)
        VALUES (?, ?, ?, ?)
      `
  );
  loanStmt.run(loan.amount, loan.purpose, loan.created_at, clientId);
  return clientId;
}

export async function createNewLoanForClient(loan: loan) {
  try {
    const stmt = db.prepare(
      `
      INSERT INTO loans (
        amount,
        balance,
        purpose,
        created_at,
        closed_at,
        status,
        client_id
      )
      VALUES (
        @amount,
        @balance,
        @purpose,
        @created_at,
        @closed_at,
        @status,
        @client_id
      )
      `
    );
    stmt.run({
      amount: loan.amount,
      balance: loan.balance,
      purpose: loan.purpose,
      created_at: loan.created_at,
      closed_at: loan.closed_at || null,
      status: loan.status || 1,
      client_id: loan.client_id
    });

    return loan.client_id;
  } catch (error) {
    console.error("Error creating new loan:", error);
    throw new Error("Failed to create new loan.");
  }
}

export async function createpayment(payment: payment) {
  const stmt = db.prepare(
    `
    INSERT INTO payments VALUES (
      null,
      @amount,
      @created_at,
      @remarks,
      @client_id,
      @loan_id
    )
    `
  );
  stmt.run(payment);
}