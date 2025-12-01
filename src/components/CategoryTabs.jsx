import React from "react";
import { LuLaptop, LuServer, LuMonitor, LuCpu, LuPrinter, LuBox } from "react-icons/lu";

const categories = [
  { id: "laptop", label: "Laptop", icon: <LuLaptop size={22} /> },
  { id: "pc", label: "PC", icon: <LuServer size={22} /> },
  { id: "monitor", label: "Màn hình", icon: <LuMonitor size={22} /> },
  { id: "build", label: "Build PC", icon: <LuBox size={22} /> },
  { id: "parts", label: "Linh kiện máy tính", icon: <LuCpu size={22} /> },
  { id: "printer", label: "Máy in", icon: <LuPrinter size={22} /> },
];

export default function CategoryTabs({ selected, onChange }) {
  return (
    <div className="flex justify-between items-center gap-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-4 overflow-x-auto">
      {categories.map((cat) => {
        const active = selected === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition 
              ${
                active
                  ? "bg-indigo-600/20 text-indigo-400 border-indigo-500 shadow-indigo-500/20"
                  : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800"
              }
            `}
          >
            <span className={active ? "text-indigo-400" : "text-neutral-400"}>
              {cat.icon}
            </span>
            <span className="font-medium whitespace-nowrap">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
