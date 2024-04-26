import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { DeliveryPlanner } from "./DeliveryPlanner.js";
import { createRequire } from "module";
import { Console } from "node:console";

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
  input.typesOfDrones,
  input.output.minutes.real
);
console.log();

// Start the local simulation
deliveryPlanner.setupOrders();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

//Adding a new order
io.on("connection", (socket) => {
  socket.on("new order", (name, order, quantity) => {
    const id = name;
    let message = deliveryPlanner.addNewOrder(name, id, { order: quantity });
    socket.emit("tracking order", message);
  });
});

app.use(express.static(__dirname));

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
