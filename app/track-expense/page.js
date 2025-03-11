import ExpenseTracker from '@/components/track-expense/ExpenseTracker'
import React from 'react'
export const metadata = {
    title: "Track Expense"
}
export default function page() {
  return (
    <div>
      <ExpenseTracker />
    </div>
  )
}
