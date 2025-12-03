"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface Column<T> {
  header: React.ReactNode;
  accessorKey: keyof T | string;
  className?: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data?: T[];
  columns?: Column<T>[];
  searchable?: boolean;
  pagination?: boolean;
  onSearch?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export default function DataTable<T>({
  data = [],
  columns = [],
  searchable: _searchable = true,
  pagination = true,
  onSearch: _onSearch,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}: DataTableProps<T>): React.ReactElement {
  const [_searchTerm, _setSearchTerm] = useState<string>("");

  // const handleSearch = (value: string): void => {
  //   setSearchTerm(value);
  //   if (onSearch) {
  //     onSearch(value);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* {searchable && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )} */}

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-8 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.cell
                        ? column.cell(row)
                        : (row as never)[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
