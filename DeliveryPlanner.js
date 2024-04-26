import { Customer } from "./Models/Customer.js";
import { Drone } from "./Models/Drone.js";
import { Location } from "./Models/Location.js";
import { Order } from "./Models/Order.js";
import { Product } from "./Models/Product.js";
import { Warehouse } from "./Models/Warehouse.js";
import { deliveryPlannerUtility } from "./deliveryPlannerUtility.js";

const pickupTime = 5; // 5 minutes for picking up the order
const deliveryTimeFrameInMinutes = 12 * 60; // Total delivery time per day in minutes (12 hours multiply by 60 minutes)
// const realTimeinMiliseconds = 400;
// const programMinutes = 10;

export class DeliveryPlanner {
  constructor(
    mapTopRightCoordinate,
    products,
    warehouses,
    customers,
    orders,
    typesOfDrones,
    realTimeinMiliseconds
  ) {
    this.mapTopRightCoordinate = new Location(
      mapTopRightCoordinate.x,
      mapTopRightCoordinate.y
    );
    this.products = products.map((product) => new Product(product));
    this.warehouses = warehouses.map(
      (warehouse) =>
        new Warehouse(warehouse.name, new Location(warehouse.x, warehouse.y))
    );
    this.customers = customers.map(
      (customer) =>
        new Customer(customer.id, customer.name, customer.coordinates)
    );
    this.orders = orders.map(
      (order) =>
        new Order(order.customerId, "to be delivered", order.productList)
    );
    this.typesOfDrones = typesOfDrones.map(
      (drone) =>
        new Drone(
          Math.round(Math.random() * this.orders.length) + 1,
          drone.capacity,
          drone.consumption
        )
    );
    this.deliveryPlannerUtility = new deliveryPlannerUtility();
    this.realTimeinMiliseconds = realTimeinMiliseconds;
  }

  setupOrders() {
    let totalTime = 0;

    this.orders.forEach((order) => {
      const currIndexForOrder = this.orders.findIndex(
        (orders) => orders === order
      );
      //Locating the nearest warehouse
      const nearestWarehouse = this.findNearestWarehouse(order);

      //Finding the customer for the current order
      const customerForCurrOrder = this.customers.find(
        (customer) => customer.id === order.customerId
      );

      //Calculating travel time for single order
      const travelTime = this.deliveryPlannerUtility.calculateDistance(
        nearestWarehouse.location,
        customerForCurrOrder.coordinates
      );

      this.orders[currIndexForOrder].setDistance(travelTime);

      // Chousing drone by his abttery capacity
      const chosenDrone = this.choseDroneTypeForAnOrder(travelTime);

      this.orders[currIndexForOrder].droneType = chosenDrone.capacity;

      if (chosenDrone !== null) {
        totalTime = totalTime + travelTime + pickupTime;

        const timeToTravel = Math.round(travelTime + pickupTime);

        console.log(
          `${timeToTravel} minutes to deliver order from ${customerForCurrOrder.name}, with drone ${chosenDrone.capacity}!`
        );
        if (
          order.customerId !== this.orders[this.orders.length - 1].customerId
        ) {
          totalTime += travelTime;
        }
      } else {
        console.log("Don't have available drones at the moment!");
      }
    });

    // Calculate the number of drones needed
    const totalDronesRequired =
      this.deliveryPlannerUtility.calculateDroneNeeded(
        this.orders,
        this.typesOfDrones,
        deliveryTimeFrameInMinutes,
        pickupTime
      );

    //Calculate average time for one one delivery
    const averageTimeForDelivery = Math.round(totalTime / this.orders.length);

    //Display the result
    console.log(
      `Average time for delivery: ${averageTimeForDelivery} minutes!`
    );
    console.log(`Total delivery time: ${Math.round(totalTime)} minutes!`);
    console.log(`Total drones will be needed: ${totalDronesRequired} drones!`);

    //Starting the simulation
    this.realTimeSimulation(this.orders, this.typesOfDrones, this.customers);
  }

  realTimeSimulation(orders, drones, customers) {
    let miliseconds = 0;
    var intervalID = setInterval(() => {
      this.processingDelivery(orders, drones, customers);
      miliseconds++;
      if (
        miliseconds >= this.realTimeinMiliseconds ||
        orders.filter((order) => order.timeToDeliver === 0).length ===
          orders.length
      ) {
        clearInterval(intervalID);
        const notCompleted = orders.filter((order) => order.timeToDeliver > 0);
        console.log(`Not compleated ordes ${notCompleted.length}`);
      }
    }, 1);
  }

  processingDelivery(orders) {
    for (let i = 0; i < orders.length; i++) {
      let currentOrder = orders[i];
      let currentUser = this.customers.find(
        (customer) => customer.id === currentOrder.customerId
      );
      if (currentOrder.timeToDeliver === 0) {
        this.deliveryPlannerUtility.printingTheOrderStatus(
          currentUser.name,
          "already delivered"
        );
      } else if (currentOrder.distance - 5 === currentOrder.timeToDeliver) {
        this.deliveryPlannerUtility.printingTheOrderStatus(
          currentUser.name,
          "currently in delivery"
        );
      } else if (currentOrder.timeToDeliver === currentOrder.distance) {
        this.deliveryPlannerUtility.printingTheOrderStatus(
          currentUser.name,
          "to be delivered"
        );
      }
      currentOrder.timeToDeliver--;
    }
  }

  findNearestWarehouse(order) {
    return this.warehouses.reduce((nearest, warehouse) => {
      const distanceToWarehouse = this.deliveryPlannerUtility.calculateDistance(
        warehouse.location,
        this.customers.find((customer) => customer.id === order.customerId)
          .coordinates
      );
      return distanceToWarehouse <
        this.deliveryPlannerUtility.calculateDistance(
          warehouse.location,
          nearest.location
        )
        ? warehouse
        : nearest;
    }, this.warehouses[0]);
  }

  choseDroneTypeForAnOrder(travelTime) {
    // Chose a drone type based on the travel time. If drone capacity contains kW I am multiply by 1000 to convert it to W.
    const availableDrones = this.typesOfDrones.filter(
      (droneType) => travelTime * droneType.consumption <= droneType.capacity
    );

    if (availableDrones.length > 0) {
      // Choose the first available drone type
      return availableDrones[0];
    }

    // No drone available with enough capacity
    return null;
  }

  // Method to add a new order dynamically TO DO
  addNewOrder(customerName, productList) {
    if (this.customers.find((customer) => customer.name === customerName)) {
      const newOrder = new Order(customerName, "To be delivered!", productList);
      this.orders.push(newOrder);
      return `The new order for customer ${customerName} with product ${productList}is added in queue!`;
    }
    throw Error("CUSTOMER NAME DOESND EXIST!");
  }
}
