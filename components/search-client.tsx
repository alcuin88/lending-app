"use client";

import {
  getClient,
  getClientIdFromSearch,
  setClientIdFromSearch,
} from "@/actions/actions";
import { Client } from "@prisma/client";
import { useEffect, useState } from "react";

export default function SearchClient({ clients }: { clients: Client[] }) {
  const [inputValue, setInputValue] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    async function checkInputValue() {
      const id = await getClientIdFromSearch();
      if (id != 0) {
        const client = await getClient(id);
        setInputValue(`${client.last_name}, ${client.first_name}`);
      }
      setClientIdFromSearch(id);
    }
    checkInputValue();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }

    if (e.target.value === "") {
      setClientIdFromSearch(0);
    }
  };

  const handleOptionClick = (client: Client) => {
    setInputValue(`${client.last_name}, ${client.first_name}`);
    setDropdownVisible(false);
    setClientIdFromSearch(client.client_id);
  };

  return (
    <div className="static w-80">
      {/* Input Field */}
      <input
        id="search"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onFocus={() => inputValue && setDropdownVisible(true)}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Delay to allow option selection
      />

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <ul className="absolute z-10 w-80 bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
          {clients
            .filter((client) =>
              `${client.last_name.toLowerCase()}, ${client.first_name.toLowerCase()}`.includes(
                inputValue.toLowerCase()
              )
            )
            .map((client) => (
              <li
                key={client.client_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleOptionClick(client)}
              >
                {`${client.last_name}, ${client.first_name}`}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
