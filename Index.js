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

const time = input.deliveryStatus;
// Start the local simulation
deliveryPlanner.calculateTotalTime();
// const name = "Dimitar Mitev";
// const id = Math.random() * name.lenght;

// let message = deliveryPlanner.trackOrder(1, time.frequency);
// console.log(message);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  
  res.sendFile(join(__dirname, "/Index.html"));
});

//Adding a new order
io.on("connection", (socket) => {
  socket.on("new order", (name, order, quantity) => {
    const id = Math.random() * name.length;
    deliveryPlanner.addNewOrder(name, id, { order: quantity });
    let message = deliveryPlanner.trackOrder(id, time.frequency);
    socket.emit("chat message", message);
  });
});

app.use(express.static(__dirname));

server.listen(3030, () => {
  console.log("server running at http://localhost:3000");
});
