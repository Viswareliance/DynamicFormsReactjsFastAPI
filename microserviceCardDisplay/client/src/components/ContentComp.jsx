import React, { useEffect, useState } from "react";
import axios from "axios";
import CardComp from "./CardComp";

const ContentComp = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedType, setSelectedType] = useState("products");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const productsRes = await axios.get("http://localhost:8001/products");
  //       setProducts(productsRes.data);

  //       const ordersRes = await axios.get("http://localhost:8002/order");
  //       setOrders(ordersRes.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get("http://localhost:8000/products");
        setProducts(productsRes.data);

        const ordersRes = await axios.get("http://localhost:8000/orders");
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType("products")}
          className={`px-4 py-2 rounded bg-blue-600 text-white ${
            selectedType === "products" ? "opacity-100" : "opacity-50"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setSelectedType("orders")}
          className={`px-4 py-2 rounded bg-green-600 text-white ${
            selectedType === "orders" ? "opacity-100" : "opacity-50"
          }`}
        >
          Orders
        </button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedType === "products" &&
          products.map((item) => <CardComp key={item.id} item={item} />)}

        {selectedType === "orders" &&
          orders.map((item) => <CardComp key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default ContentComp;
