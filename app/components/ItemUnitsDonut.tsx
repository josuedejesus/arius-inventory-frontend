"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { ITEM_UNIT_STATUS_CONFIG } from "@/constants/ItemUnitStatus";

export default function ItemUnitsDonut({ stats }: { stats: any }) {
  console.log("stats", stats);
  const parse = (v: any) => Number(v || 0);

  const data = Object.values(ItemUnitStatus)
    .map((status) => {
      const config = ITEM_UNIT_STATUS_CONFIG[status];

      return {
        name: config.label,
        value: parse(stats?.[status.toLowerCase()]),
        color: config.color,
      };
    })
    .filter((d) => d.value > 0);

  return (
    <div className="flex justify-center items-center gap-6">
      {/* 🔷 DONUT */}
      <div className="w-40 h-40">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔷 LEYENDA */}
      <div className="space-y-2 text-xs">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
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
