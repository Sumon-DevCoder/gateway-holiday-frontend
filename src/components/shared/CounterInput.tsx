"use client";
import React from "react";

type CounterInputProps = {
  label: string;
  field: string;
  value: number;
  onChange: (newValue: number) => void;
};

const CounterInput: React.FC<CounterInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const decrease = () => onChange(Math.max(0, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <div className="mb-6 px-3">
      <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
        {label}
      </label>
      <div className="relative">
        {/* Decrease Button */}
        <div className="absolute inset-y-0 left-2 z-10 flex items-center">
          <button
            type="button"
            onClick={decrease}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-500 shadow-md transition-colors hover:bg-gray-100 sm:h-10 sm:w-10"
          >
            -
          </button>
        </div>

        {/* Value Input */}
        <input
          type="text"
          value={value}
          readOnly
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-12 py-2.5 text-center text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        />

        {/* Increase Button */}
        <div className="absolute inset-y-0 right-2 z-10 flex items-center">
          <button
            type="button"
            onClick={increase}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-blue-500 shadow-md transition-colors hover:bg-gray-100 sm:h-10 sm:w-10"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterInput;
