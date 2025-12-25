const DROP_KEY = "heavy_drop_register";

// get all registrations
export function getDropRegisters() {
  return JSON.parse(localStorage.getItem(DROP_KEY)) || [];
}

// save helper
function saveRegisters(data) {
  localStorage.setItem(DROP_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dropUpdated")); // realtime update
}

// add a register entry
export function addDropRegister({ name, email, drop }) {
  const registers = getDropRegisters();

  registers.push({
    id: Date.now(),
    name,
    email,
    drop,
    time: new Date().toLocaleString(),
  });

  saveRegisters(registers);
}

// delete a register entry (admin)
export function deleteDropRegister(id) {
  const updated = getDropRegisters().filter(r => r.id !== id);
  saveRegisters(updated);
}

// clear all (after drop ends)
export function clearDropRegister() {
  saveRegisters([]);
}
