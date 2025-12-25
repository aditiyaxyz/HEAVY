import { useEffect, useState } from "react";
import {
  addDropRegister,
  getDropRegisters,
  deleteDropRegister,
} from "../services/dropRegisterService";

export default function DropRegister() {
  const [registers, setRegisters] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    drop: "HEAVY DROP 01",
  });

  const load = () => setRegisters(getDropRegisters());

  useEffect(() => {
    load();
    window.addEventListener("dropUpdated", load);
    return () => window.removeEventListener("dropUpdated", load);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Drop Register</h2>

      <div className="flex gap-2 mb-4">
        <input className="border p-2 w-full" placeholder="Name"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <button className="bg-black text-white px-4"
          onClick={() => {
            addDropRegister(form);
            setForm({ ...form, name: "", email: "" });
          }}>
          Register
        </button>
      </div>

      <div className="space-y-2">
        {registers.map(r => (
          <div key={r.id} className="border p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm">{r.email}</p>
              <p className="text-xs text-gray-500">{r.time}</p>
            </div>
            <button className="bg-red-600 text-white px-3" onClick={() => deleteDropRegister(r.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
