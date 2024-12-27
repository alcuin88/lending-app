export const DUMMY_CLIENTS = [
  {
    first_name: "Alcuin Allan",
    middle_name: "Enclona",
    last_name: "Andrade",
  },
  {
    first_name: "Chenmarie Grace",
    middle_name: "Collarga",
    last_name: "Andrade",
  }
]

export const DUMMY_PAYMENTS = [
  {
    client_id: 1,
    amount: 2000,
    loan_id: 1,
    created_at: "2024-12-13"
  }
]

export const DUMMY_LOANS = [
  {
    amount: 1500,
    purpose: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    created_at: "2024-12-12",
    closed_at: "",
    status: 1,
    client_id: 1,
  },
  {
    client_id: 1,
    amount: 3000,
    purpose: "Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu dapibus purus integer taciti proin porttitor quisque.",
    created_at: "2024-11-4",
    closed_at: "",
    status: 1
  },
  {
    client_id: 1,
    amount: 10000,
    purpose: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    created_at: "2024-2-12",
    closed_at: "",
    status: 1
  },
  {
    client_id: 2,
    amount: 2000,
    purpose: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    created_at: "2024-12-12",
    closed_at: "",
    status: 1
  },
  {
    client_id: 1,
    amount: 2000,
    purpose: "Lorem ipsum odor amet, consectetuer adipiscing elit.",
    created_at: "2023-12-25",
    closed_at: "2024-11-25",
    status: 0
  }
]