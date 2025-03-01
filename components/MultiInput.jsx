"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addGetValue, addInput, deleteInput, updateInput } from "@/firebase/FirebaseFunction";

const MultiInputForm = () => {
  const [inputValues, setInputValues] = useState({
    id: "",
    address: "",
    phone: "",
    email: "",
  });

  const [entries, setEntries] = useState([]);
  const [updateStatus, setUpdateStatus] = React.useState(false);

  const getData = async ()=>{
   let v = await addGetValue()
   setEntries(v);
  }

  useEffect(() => {
    // You can fetch data from Firebase here if needed
    getData()
  }, []);

  // Add or Update an Entry
  const handleAddOrUpdate = () => {
    if (
      inputValues.id.trim() === "" ||
      inputValues.address.trim() === "" ||
      inputValues.phone.trim() === "" ||
      inputValues.email.trim() === ""
    ) {
      alert("Please enter all details");
      return;
    }

    // Check if ID already exists for update
    const existingIndex = entries.findIndex((entry) => entry.id === inputValues.id);
    
    if (existingIndex !== -1) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = inputValues;
      setEntries(updatedEntries);
      updateInput(inputValues);
      alert("Details updated successfully!");
      setUpdateStatus(false);
    } else {
      // Add new entry
      setEntries([...entries, inputValues]);
      addInput(inputValues); // Save to Firebase
      alert("New entry added successfully!");
      setUpdateStatus(false);
    }

    // Clear input fields
    setInputValues({ id: "", address: "", phone: "", email: "" });
  };

  // Delete an Entry
  const handleDelete = (v) => {
    const updatedEntries = entries.filter((entry) => entry.id !== v.id);
    deleteInput(v.sid);
    setEntries(updatedEntries);
    alert("Entry deleted successfully!");
  };

  // Load data into input fields for editing
  const handleEdit = (entry) => {
    setUpdateStatus(true);
    setInputValues(entry);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Inputs with ID</h2>

      {/* ID Input */}
      <div className="mb-4">
        <label className="block font-medium">ID</label>
        <input
          type="text"
          value={inputValues.id}
          onChange={(e) => setInputValues({ ...inputValues, id: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter ID"
          disabled={updateStatus}
        />
      </div>

      {/* Input Fields */}
      {["address", "phone", "email"].map((type) => (
        <div key={type} className="mb-4">
          <label className="block font-medium capitalize">{type}</label>
          <input
            type={type === "phone" ? "tel" : "text"}
            value={inputValues[type]}
            onChange={(e) => setInputValues({ ...inputValues, [type]: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder={`Enter ${type}`}
          />
        </div>
      ))}

      {/* Add / Update Button */}
      <button
        onClick={handleAddOrUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        {entries.some((entry) => entry.id === inputValues.id) ? "Update" : "Add"}
      </button>

      {/* Display List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Entries</h3>
        <AnimatePresence>
          {entries.length === 0 ? (
            <p className="text-gray-500">No entries added yet.</p>
          ) : (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md mb-2"
              >
                <div>
                  <p><strong>ID:</strong> {entry.id}</p>
                  <p><strong>Address:</strong> {entry.address}</p>
                  <p><strong>Phone:</strong> <a href={`tel:${entry.phone}`} className="text-blue-600 underline">{entry.phone}</a></p>
                  <p><strong>Email:</strong> {entry.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌ Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MultiInputForm;
