"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Menu, X, Settings } from 'lucide-react';
// import { useTheme } from './ThemeProvider';

const ResponsiveTable = () => {
//   const { theme, toggleTheme } = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState({
    id: true,
    name: true,
    created_by: true,
    created_date: true,
    closed_date: true,
    assigned_to: true
  });

  // Sample data
  const data = [
    { id: 1, name: 'Task 1', created_by: 'John Doe', created_date: '2025-03-10', closed_date: '2025-03-13', assigned_to: 'Alice Smith' },
    { id: 2, name: 'Task 2', created_by: 'Jane Smith', created_date: '2025-03-11', closed_date: null, assigned_to: 'Bob Johnson' },
    { id: 3, name: 'Task 3', created_by: 'Bob Johnson', created_date: '2025-03-12', closed_date: null, assigned_to: 'Jane Smith' },
    { id: 4, name: 'Task 4', created_by: 'Alice Smith', created_date: '2025-03-09', closed_date: '2025-03-12', assigned_to: 'John Doe' },
    { id: 5, name: 'Task 5', created_by: 'John Doe', created_date: '2025-03-08', closed_date: null, assigned_to: 'Alice Smith' },
  ];

  const toggleColumn = (columnName) => {
    setColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const toggleAllRows = (checked) => {
    if (checked) {
      setSelectedRows(data.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const visibleColumns = Object.entries(columns)
    .filter(([_, isVisible]) => isVisible)
    .map(([columnName]) => columnName);

  return (
    <div className={`min-h-screen p-4 bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex space-x-2">
          {/* <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button> */}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className={'bg-white text-gray-900'}>
              <SheetHeader>
                <SheetTitle>Column Visibility</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {Object.entries(columns).map(([columnName, isVisible]) => (
                  <div key={columnName} className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id={`column-${columnName}`}
                      checked={isVisible}
                      onCheckedChange={() => toggleColumn(columnName)}
                    />
                    <label htmlFor={`column-${columnName}`} className="text-sm capitalize">
                      {columnName.replace('_', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={'bg-gray-100'}>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRows.length === data.length}
                    onCheckedChange={toggleAllRows}
                  />
                </TableHead>
                {visibleColumns.map(column => (
                  <TableHead key={column} className="capitalize">
                    {column.replace('_', ' ')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {data.map(row => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${
                      selectedRows.includes(row.id) 
                        ?  'bg-blue-50' 
                        :  'bg-white'
                    } hover:${
                      'bg-gray-50'
                    }`}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </TableCell>
                    {visibleColumns.map(column => (
                      <TableCell key={`${row.id}-${column}`}>
                        {row[column] || '-'}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// Theme provider component
const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('light');

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// const ThemeContext = React.createContext({
//   theme: 'light',
//   toggleTheme: () => {},
// });

// const useTheme = () => {
//   return React.useContext(ThemeContext);
// };

// export { ThemeProvider, useTheme };
export default ResponsiveTable;