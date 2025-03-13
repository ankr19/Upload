"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300 }
  }
};


const formatDate = (date) => {
  if (!date) return '';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  // Format like "March 11, 2025"
  const formatLong = `${months[month]} ${day}, ${year}`;

  // Format like "Mar 11, 2025"
  const formatShort = `${shortMonths[month]} ${day}, ${year}`;

  return formatLong;
};

export default function ExpenseTracker() {
  const [date, setDate] = useState(new Date());
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
      <Card className="border border-blue-500">
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
          <motion.div variants={itemVariants}>
            <div className="space-y-1 sm:space-y-2">
              <Label className="text-sm sm:text-base">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-sm sm:text-base"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button className="w-full my-2 bg-white text-blue-500 border-blue-500 border cursor-pointer hover:bg-blue-500 hover:text-white ">Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
