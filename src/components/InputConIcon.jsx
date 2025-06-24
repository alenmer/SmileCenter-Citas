import React from "react";

export default function InputConIcon({
  icon,
  iconColor = "#f59e0b",
  value,
  onChange,
  options = [],
  placeholder = "Seleccione",
  disabled = false,
}) {
  return (
    <div className="input-con-icon">
      <span style={{ color: iconColor }}>{icon}</span>
      <select value={value} onChange={onChange} disabled={disabled}>
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
