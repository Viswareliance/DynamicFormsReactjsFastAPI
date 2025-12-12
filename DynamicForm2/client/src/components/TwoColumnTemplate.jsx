import React from "react";

export default function TwoColumnTemplate({ properties }) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {properties.map((prop) => (
        <div key={prop.content.key} className="flex-1 min-w-[200px]">
          {prop.content}
        </div>
      ))}
    </div>
  );
}
