import React from "react";
import Label from "@/components/atoms/Label";
import Checkbox from "@/components/atoms/Checkbox";

const FilterGroup = ({ title, options, selectedValues, onChange }) => {
  const handleCheckboxChange = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-slate-700">{title}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
            />
            <Label 
              htmlFor={`${title}-${option.value}`}
              className="text-sm text-slate-600 cursor-pointer flex-1"
            >
              {option.label}
              {option.count && (
                <span className="ml-1 text-xs text-slate-400">({option.count})</span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;