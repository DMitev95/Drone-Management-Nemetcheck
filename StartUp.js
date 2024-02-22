import { DeliveryPlanner } from "./DeliveryPlanner.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fs = require("fs");
let data = fs.readFileSync("input.json");
let input = JSON.parse(data);

// Create DeliveryPlanner instance
const deliveryPlanner = new DeliveryPlanner(
  input["map-top-right-coordinate"],
  input.products,
  input.warehouses,
  input.customers,
  input.orders,
  input.typesOfDrones
);

// Start the simulation
deliveryPlanner.calculateTotalTime();

// addingNeworder() {
//   deliveryPlanner.addNewOrder(4, { eggs: 8 })
// };

// Dynamically add a new order during the simulation
//This is not right!!!
// setTimeout(() => {
//   const deliveryPlanner = new DeliveryPlanner(
//     input["map-top-right-coordinate"],
//     input.products,
//     input.warehouses,
//     input.customers,
//     input.orders,
//     input.typesOfDrones
//   );

//   // Start the simulation
//   deliveryPlanner.calculateTotalTime();
// }, 3000); // Add a new order after 5 seconds

//program / realt или както трябва да е формулата
