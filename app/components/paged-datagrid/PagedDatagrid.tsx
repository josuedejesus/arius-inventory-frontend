"use client";

import React, { createContext, useContext } from "react";
import { Column } from "./DatagridColumn";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

type GridContextType = {
  data: any[];
};

const GridContext = createContext<GridContextType | null>(null);

export function useGrid() {
  const ctx = useContext(GridContext);

  if (!ctx) {
    throw new Error("Grid components must be inside PagedDataGrid");
  }

  return ctx;
}

type ColumnProps = {
  field: string;
  title: string;
  children?: (row: any) => React.ReactNode;
  width?: string; // 🔥 NUEVO
};

type Props = {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  onLoadData: (params: { skip: number; take: number }) => void;
  children: React.ReactNode;
  pagination?: boolean;
  onRowClick?: (row: any) => void;
};

type PagedDataGridType = React.FC<Props> & {
  Column: typeof Column;
};

const PagedDataGrid = (({
  data,
  total,
  page,
  pageSize,
  onLoadData,
  children,
  pagination = true,
  onRowClick,
}: Props) => {
  const columns = React.Children.toArray(
    children,
  ) as React.ReactElement<ColumnProps>[];

  const columnCount = columns.length;

  // 🔥 TEMPLATE DINÁMICO
  const gridTemplate = columns
    .map((col) => col.props.width || "minmax(120px, 1fr)")
    .join(" ");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(windowSize, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - windowSize + 1);
    }

    const pages: number[] = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const skip = (newPage - 1) * pageSize;

    onLoadData({
      skip,
      take: pageSize,
    });
  };

  return (
    <GridContext.Provider value={{ data }}>
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* HEADER */}
        <div
          className="grid text-sm text-gray-500 border-b border-gray-200 bg-gray-50"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <div key={col.props.field} className="p-2 font-semibold">
              {col.props.title}
            </div>
          ))}
        </div>

        {/* ROWS */}
        {data.map((row) => (
          <div
            key={row.id}
            className="grid border-b text-sm text-gray-600 last:border-0 border-gray-200 hover:bg-gray-50 cursor-pointer"
            style={{ gridTemplateColumns: gridTemplate }}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div
                key={col.props.field}
                className="flex items-center p-2 truncate"
              >
                {col.props.children
                  ? col.props.children(row)
                  : row[col.props.field]}
              </div>
            ))}
          </div>
        ))}

        {/* PAGINATION */}
        {pagination && (
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-gray-50">
            <div className="space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                <MdFirstPage />
              </button>

              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                <MdNavigateBefore />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {getVisiblePages(page, totalPages).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 border rounded ${
                    page === p
                      ? "bg-blue-400 text-white border-blue-400"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                <MdNavigateNext />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                <MdLastPage />
              </button>
            </div>
          </div>
        )}
      </div>
    </GridContext.Provider>
  );
}) as PagedDataGridType;

PagedDataGrid.Column = Column;

export default PagedDataGrid;
