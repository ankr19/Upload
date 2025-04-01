import ExpenseTracker from '@/components/track-expense/ExpenseTracker'
import ResponsiveTable from '@/components/track-expense/ResponsiveTable'
import React from 'react'
export const metadata = {
    title: "Track Expense"
}
export default function page() {
  return (
    <div>
      <ExpenseTracker />
      <ResponsiveTable />
    </div>
  )
}
