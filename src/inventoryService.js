const INVENTORY_KEY = "heavy_inventory";

export function getInventory() {
  return JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
}

function saveInventory(data) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("inventoryUpdated"));
}

export function addItem({ name, stock }) {
  const inventory = getInventory();
  inventory.push({
    id: Date.now(),
    name,
    stock: Number(stock),
  });
  saveInventory(inventory);
}

export function deleteItem(id) {
  const inventory = getInventory().filter(i => i.id !== id);
  saveInventory(inventory);
}

export function placeOrder(id, qty = 1) {
  const inventory = getInventory();
  const item = inventory.find(i => i.id === id);
  if (!item || item.stock < qty) return;
  item.stock -= qty;
  saveInventory(inventory);
}

export function restockItem(id, qty) {
  const inventory = getInventory();
  const item = inventory.find(i => i.id === id);
  if (!item) return;
  item.stock += qty;
  saveInventory(inventory);
}