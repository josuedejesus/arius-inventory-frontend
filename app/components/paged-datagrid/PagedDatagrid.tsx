"use client";

import React, { createContext, useContext, useEffect } from "react";
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
};

type Props = {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  onLoadData: (params: { skip: number; take: number }) => void;
  children: React.ReactNode;
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
}: Props) => {
  const columns = React.Children.toArray(
    children,
  ) as React.ReactElement<ColumnProps>[];

  const columnCount = columns.length;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getVisiblePages = (currentPage: number, totalPages: number) => {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  // Ajuste inicio
  if (start < 1) {
    start = 1;
    end = Math.min(windowSize, totalPages);
  }

  // Ajuste final
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

  /* 🔁 CAMBIO DE PÁGINA */
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const skip = (newPage - 1) * pageSize;

    onLoadData({
      skip: skip,
      take: pageSize,
    });
  };

  return (
    <GridContext.Provider value={{ data }}>
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* HEADER */}
        <div
          className="grid text-sm text-gray-500 border-b border-gray-200 bg-gray-50"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0,1fr))`,
          }}
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
            className="grid border-b text-sm text-gray-600 last:border-0 border-gray-200 hover:bg-gray-50"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0,1fr))`,
            }}
          >
            {columns.map((col) => (
              <div key={col.props.field} className="flex items-center p-2">
                {col.props.children
                  ? col.props.children(row)
                  : row[col.props.field]}
              </div>
            ))}
          </div>
        ))}

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-gray-50">
          <div className="space-x-2">
            {/* FIRST */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <MdFirstPage />
            </button>

            {/* PREV */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <MdNavigateBefore />
            </button>
          </div>

          {/* NUMBERS */}
          <div className="flex items-center gap-1">
            {getVisiblePages(page, totalPages).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 border rounded transition-all duration-150 ${
                  page === p
                    ? "bg-blue-400 text-white border-blue-400 shadow-sm"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="space-x-2">
            {/* NEXT */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <MdNavigateNext />
            </button>

            {/* LAST */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <MdLastPage />
            </button>
          </div>
        </div>
      </div>
    </GridContext.Provider>
  );
}) as PagedDataGridType;

/* 👇 SUBCOMPONENT */
PagedDataGrid.Column = Column;

export default PagedDataGrid;
