"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ExpenseTracker() {
  const [category, setCategory] = useState("");
  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Other",
  ];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div>
            <Label className="mb-2">Description</Label>
            <Input type="text" name="desc" required />
          </div>
          <div className="mt-2">
            <Label htmlFor="category" className="text-sm sm:text-base mb-2">
              Category
            </Label>
            <Select className="" value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="text-sm sm:text-base w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
