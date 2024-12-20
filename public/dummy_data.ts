export const DUMMY_CLIENTS = [
  {
    client_id: 1,
    first_name: "Alcuin Allan",
    middle_name: "Enclona",
    last_name: "Andrade",
  },
  {
    client_id: 2,
    first_name: "Chenmarie Grace",
    middle_name: "Collarga",
    last_name: "Andrade",
  }
]

export const DUMMY_PAYMENTS = [
  {
    client_id: 1,
    amount: 2000,
    created_at: "2024-12-13"
  }
]

export const DUMMY_LOANS = [
  {
    amount: 5000,
    purpose: "Buy toys.",
    created_at: "2024-12-12",
    closed_at: "",
    status: 1,
    client_id: 1,
  },
  {
    client_id: 1,
    amount: 5000,
    purpose: "Buy groceries.",
    created_at: "2024-11-4",
    closed_at: "",
    status: 1
  },
  {
    client_id: 1,
    amount: 5000,
    purpose: "Buy headlight bulb.",
    created_at: "2024-2-12",
    closed_at: "",
    status: 1
  },
  {
    client_id: 2,
    amount: 2000,
    purpose: "Rebond",
    created_at: "2024-12-12",
    closed_at: "",
    status: 1
  },
  {
    client_id: 1,
    amount: 2000,
    purpose: "Rebond",
    created_at: "2023-12-25",
    closed_at: "2024-11-25",
    status: 0
  }
]