"use client";

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  sortable?: boolean;
};

type DataTableProps<T extends { id: number }> = {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  loading?: boolean;
};

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  searchFields,
  searchPlaceholder,
  loading = false,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchFields || !debouncedSearch) return data;

    const lower = debouncedSearch.toLowerCase();

    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(lower),
      ),
    );
  }, [data, searchFields, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    const sortable = [...filteredData];

    if (sortField) {
      sortable.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortable;
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof T) => {
    if (sortField !== field)
      return <ArrowUpDown size={14} className="text-gray-400" />;

    return sortOrder === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all ${
            currentPage === i
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: pageSize }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {columns.map((col, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div
              className={`h-4 rounded bg-gray-200 ${
                col.header === "Actions" ? "w-24" : "w-full"
              }`}
            />
          </td>
        ))}
      </tr>
    ));
  };

  const handleConfirmDelete = async () => {
    if (!onDelete || deleteId === null) return;

    try {
      setDeleteLoading(true);
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="w-full border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {searchFields && (
              <div className="relative w-full max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder || "Search..."}
                  className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-150">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      onClick={() =>
                        col.sortable && col.accessor && handleSort(col.accessor)
                      }
                      className={`px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${
                        col.sortable
                          ? "cursor-pointer select-none hover:text-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {col.header}
                        {col.sortable &&
                          col.accessor &&
                          getSortIcon(col.accessor)}
                      </div>
                    </th>
                  ))}

                  {(onEdit || onDelete) &&
                    !columns.some((c) => c.header === "Actions") && (
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  renderSkeletonRows()
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                      className="p-12 text-center text-gray-400 italic"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {columns.map((col, index) => (
                        <td
                          key={index}
                          className="px-6 py-4 text-sm text-gray-700 font-medium"
                        >
                          {col.accessor ? String(row[col.accessor]) : null}

                          {!col.accessor && col.header === "Actions" && (
                            <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all">
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(row)}
                                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                                >
                                  <Pencil size={16} />
                                  Edit
                                </button>
                              )}

                              {onDelete && (
                                <button
                                  onClick={() => setDeleteId(row.id)}
                                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Rows per page:</span>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-1.5 outline-none hover:border-gray-400"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <span className="text-xs text-gray-400 ml-2">
              Showing{" "}
              {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">{renderPageNumbers()}</div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected item will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
