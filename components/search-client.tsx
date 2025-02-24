"use client";

import {
  getClientIdFromSearch,
  setClientIdFromSearch,
} from "@/actions/loan-creation.form.actions";
import { Client } from "@/lib/interface";
import { useEffect, useState } from "react";

export default function SearchClient({ clients }: { clients: Client[] }) {
  const [inputValue, setInputValue] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    async function checkInputValue() {
      const id = await getClientIdFromSearch();
      if (id != 0) {
        const client = clients.find((client) => client.client_id === id);
        if (!client) {
          setInputValue("");
          return;
        }
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
      setDropdownVisible(true);
      setClientIdFromSearch(0);
    }
  };

  const handleOptionClick = (client: Client) => {
    setInputValue(`${client.last_name}, ${client.first_name}`);
    setDropdownVisible(false);
    setClientIdFromSearch(client.client_id);
  };

  return (
    <div className="static w-80 sm:w-80">
      <input
        id="search"
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onClick={() => setDropdownVisible(true)}
        placeholder="Search..."
        className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onFocus={() => inputValue && setDropdownVisible(true)}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
      />

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
