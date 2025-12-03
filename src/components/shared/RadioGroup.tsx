"use client";
import React from "react";

type Option = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="px-3 mb-6">
      <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-4">
        {label}
      </label>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-200 text-sm sm:text-base font-medium">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
