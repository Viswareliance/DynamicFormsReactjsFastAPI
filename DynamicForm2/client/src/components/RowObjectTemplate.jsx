// src/RowObjectTemplate.jsx
import React from "react";

const RowObjectTemplate = (props) => {
  // DEBUG: show in console when template is invoked
  // props.properties contains array of field objects (name + content)
  console.log("RowObjectTemplate props:", props);

  return (
    <div className="rjsf-object-row w-full">
      {/* Force a 2-column grid via tailwind; CSS override above makes it final proof */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {props.properties.map((prop) => (
          <div key={prop.name} className="w-full">
            {prop.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowObjectTemplate;
