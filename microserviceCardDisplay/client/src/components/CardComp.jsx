import React from "react";

const CardComp = ({ item }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl transition">
      {/* If Product */}
      {item.name && (
        <>
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="text-gray-600">Price: ₹{item.price}</p>
          <p className="text-gray-600">Category: {item.category_id}</p>
        </>
      )}

      {/* If Order */}
      {item.product_ids && (
        <>
          <h3 className="text-xl font-semibold">Order #{item.id}</h3>
          <p className="text-gray-600">Customer: {item.customer_id}</p>
          <p className="text-gray-600">
            Products: {item.product_ids.join(", ")}
          </p>
          <p className="text-gray-600">Total: ₹{item.total_amount}</p>
        </>
      )}
    </div>
  );
};

export default CardComp;
