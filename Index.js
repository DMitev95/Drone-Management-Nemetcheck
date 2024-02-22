import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { DeliveryPlanner } from "./DeliveryPlanner.js";
import { createRequire } from "module";

//Reading the input.json file
const require = createRequire(import.meta.url);
const fs = require("fs");
let data = fs.readFileSync("input.json");
let input = JSON.parse(data);

//Open live traking for the order
const app = express();
const server = createServer(app);
const io = new Server(server);

// Create DeliveryPlanner instance
const deliveryPlanner = new DeliveryPlanner(
  input["map-top-right-coordinate"],
  input.products,
  input.warehouses,
  input.customers,
  input.orders,
  input.typesOfDrones
);

// Start the local simulation
deliveryPlanner.calculateTotalTime();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

//Adding new order
io.on("connection", (socket) => {
  socket.on("new order", (name, order, quantity) => {
    let message = deliveryPlanner.addNewOrder(name, 4, { order: quantity });
    socket.emit("chat message", message);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
