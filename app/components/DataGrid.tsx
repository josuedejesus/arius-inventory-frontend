"use client";

import React, { ReactNode, useState } from "react";

export interface ColumnDef<T = Record<string, unknown>> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
}

export interface DataGridProps<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  rows: T[];
  renderCard: (row: T) => ReactNode;
  gridTemplate?: string;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
}

export function DataGrid<T extends Record<string, unknown>>({
  columns,
  rows,
  renderCard,
  gridTemplate,
  searchKeys = [],
  searchPlaceholder = "Buscar…",
}: DataGridProps<T>) {
  const [query, setQuery] = useState("");

  const template = gridTemplate ?? `repeat(${columns.length}, 1fr)`;

  const filtered =
    query.trim() && searchKeys.length
      ? rows.filter((row) =>
          searchKeys.some((k) =>
            String(row[k] ?? "")
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
        )
      : rows;

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="relative flex items-center">
        {" "}
        <svg
          className="absolute left-3 text-gray-400 pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="w-full py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
          style={{ paddingLeft: 32, paddingRight: 32 }}
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="absolute text-xs text-gray-400 hover:text-gray-600"
            style={{ right: 12, top: "50%", transform: "translateY(-50%)" }}
            onClick={() => setQuery("")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white overflow-hidden border border-gray-200 shadow-sm">
        {/* Header */}
        <div
          className="grid px-4 py-3 text-[11px] tracking-wide text-gray-500 uppercase bg-gray-50 border-b border-gray-200"
          style={{ gridTemplateColumns: template }}
        >
          {columns.map((col) => (
            <span key={col.key}>{col.title}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            Sin resultados para "{query}"
          </p>
        ) : (
          filtered.map((row, i) => (
            <div
              key={i}
              className="dg-row w-full border-b border-gray-100 last:border-b-0"
            >
              {renderCard(row)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DataGrid;
