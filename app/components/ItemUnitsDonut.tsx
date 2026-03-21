"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS: any = {
  Disponibles: "#22c55e",
  Reservados: "#f97316",
  "Sin ubicación": "#ef4444",
  Rentados: "#3b82f6",
  "En tránsito": "#eab308",
};

export default function ItemUnitsDonut({ stats }: { stats: any }) {
  const parse = (v: any) => Number(v || 0);

  const data = [
    { name: "Disponibles", value: parse(stats?.available_units) },
    { name: "Reservados", value: parse(stats?.reserved_units) },
    { name: "Sin ubicación", value: parse(stats?.without_location) },
    { name: "Rentados", value: parse(stats?.rented_units) },
    { name: "En tránsito", value: parse(stats?.in_transit_units) },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex justify-center items-center gap-4">
      {/* 🔷 DONUT */}
      <div className="w-32 h-50">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔷 LEYENDA */}
      <div className="space-y-1 text-xs">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[d.name] }}
              />
              <span className="text-gray-600">{d.name}</span>
            </div>

            <span className="font-medium text-gray-800">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
