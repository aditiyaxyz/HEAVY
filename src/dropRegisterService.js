const DROP_KEY = "heavy_drop_register";

export function getDropRegisters() {
  return JSON.parse(localStorage.getItem(DROP_KEY)) || [];
}

function saveRegisters(data) {
  localStorage.setItem(DROP_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dropUpdated"));
}

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

export function deleteDropRegister(id) {
  const updated = getDropRegisters().filter(r => r.id !== id);
  saveRegisters(updated);
}

export function clearDropRegister() {
  saveRegisters([]);
}