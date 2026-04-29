import React from 'react'

export const ToggleButton = ({ label, checked, onChange }) => {
  return (
     <div className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0">
    <span className="text-sm text-gray-700">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
    </label>
  </div>
  )
}
