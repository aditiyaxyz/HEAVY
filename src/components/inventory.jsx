import { useEffect, useState } from "react";
import {
  getInventory,
  addItem,
  deleteItem,
  placeOrder,
  restockItem,
} from "../services/inventoryService";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  const load = () => setItems(getInventory());

  useEffect(() => {
    load();
    window.addEventListener("inventoryUpdated", load);
    return () => window.removeEventListener("inventoryUpdated", load);
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Inventory</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-full"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-24"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />
        <button
          className="bg-black text-white px-4"
          onClick={() => {
            if (!name || !stock) return;
            addItem({ name, stock });
            setName("");
            setStock("");
          }}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="border p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>Stock: {item.stock}</p>
            </div>

            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3" onClick={() => placeOrder(item.id)}>
                Order
              </button>
              <button className="bg-blue-600 text-white px-3" onClick={() => restockItem(item.id, 1)}>
                +1
              </button>
              <button className="bg-red-600 text-white px-3" onClick={() => deleteItem(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
