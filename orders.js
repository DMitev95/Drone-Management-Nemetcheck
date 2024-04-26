const socket = io();
const form = document.getElementById("form");
const inputName = document.getElementById("input-name");
const inputOrder = document.getElementById("input-order");
const inputQuantity = document.getElementById("input-quantity");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputName.value && inputOrder.value && inputQuantity.value) {
    socket.emit(
      "new order",
      inputName.value,
      inputOrder.value,
      inputQuantity.value
    );
    inputName.value = "";
    inputOrder.value = "";
    inputQuantity.value = "";
  }
});

socket.on("tracking order", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
