import { Customer } from "./Models/Customer.js";
import { DroneType } from "./Models/DroneType.js";
import { Location } from "./Models/Location.js";
import { Order } from "./Models/Order.js";
import { Product } from "./Models/Product.js";
import { Warehouse } from "./Models/Warehouse.js";

export class DeliveryPlanner {
  constructor(
    mapTopRightCoordinate,
    products,
    warehouses,
    customers,
    orders,
    typesOfDrones
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
        new DroneType(
          Math.round(Math.random() * this.orders.length) + 1,
          drone.capacity,
          drone.consumption
        )
    );
  }

  calculateTotalTime() {
    let totalTime = 0;
    const pickupTime = 5; // 5 minutes for picking up the order
    const deliveryTimeFrameInMinutes = 12 * 60; // Total delivery time per day in minutes (12 hours multiply by 60 minutes)

    this.orders.forEach((order) => {
      //Locating the nearest warehouse
      const nearestWarehouse = this.findNearestWarehouse(order);

      //Finding the customer for the current order
      const customerForCurrOrder = this.customers.find(
        (customer) => customer.id === order.customerId
      );

      //Calculating travel time for single order
      const travelTime = this.calculateDistance(
        nearestWarehouse.location,
        customerForCurrOrder.coordinates
      );

      // Chousing drone by his abttery capacity
      const choosenDrone = this.chooseDroneType(travelTime);

      if (order.customerId === this.orders[this.orders.length - 1].customerId) {
        if (choosenDrone !== null) {
          totalTime = totalTime + travelTime + pickupTime;
          const timeToTravel = Math.round(travelTime + pickupTime);
          console.log(
            `${timeToTravel} to deliver order from ${customerForCurrOrder.name}, with drone ${choosenDrone.capacity}!`
          );
        } else {
          console.log("Dont have available drones at the moment!");
        }
      } else {
        if (choosenDrone !== null) {
          totalTime = totalTime + travelTime + pickupTime + travelTime;
          const timeToTravel = Math.round(travelTime + pickupTime);
          console.log(
            `${timeToTravel} minutes to deliver order from ${customerForCurrOrder.name}, with drone ${choosenDrone.capacity}!`
          );
        } else {
          console.log("Dont have available drones at the moment!");
        }
      }
    });

    // Calculate the number of drones needed
    const totalDronesRequired = Math.ceil(
      (deliveryTimeFrameInMinutes / totalTime) * this.orders.length
    );

    //Calculate average time for one one delivery
    const averageTimeForDelivery = Math.ceil(totalTime / this.orders.length);

    //Display the result
    console.log(
      `Average time for delivery: ${averageTimeForDelivery} minutes!`
    );
    console.log(`Total delivery time: ${Math.round(totalTime)} minutes!`);
    console.log(`Total drones will be needed: ${totalDronesRequired} drones!`);
  }

  findNearestWarehouse(order) {
    return this.warehouses.reduce((nearest, warehouse) => {
      const distanceToWarehouse = this.calculateDistance(
        warehouse.location,
        this.customers.find((customer) => customer.id === order.customerId)
          .coordinates
      );
      return distanceToWarehouse <
        this.calculateDistance(warehouse.location, nearest.location)
        ? warehouse
        : nearest;
    }, this.warehouses[0]);
  }

  calculateDistance(wareHouseLocation, customerLocation) {
    return Math.sqrt(
      Math.pow(customerLocation.x - wareHouseLocation.x, 2) +
        Math.pow(customerLocation.y - wareHouseLocation.y, 2)
    );
  }

  //TO DO
  isOutsideMapBounds(coordinates, mapTopRightCoordinate) {
    return (
      this.x < 0 ||
      this.x > mapTopRightCoordinate.x ||
      this.y < 0 ||
      this.y > mapTopRightCoordinate.y
    );
  }

  chooseDroneType(travelTime) {
    // Choose a drone type based on the travel time. If drone capacity contains kW I am multiply by 1000 to convert it to W.
    const availableDrones = this.typesOfDrones.filter((droneType) =>
      travelTime *
        parseInt(
          droneType.consumption.substring(0, droneType.consumption.length - 1)
        ) <=
      droneType.capacity.includes("kW")
        ? parseInt(
            droneType.capacity.substring(0, droneType.capacity.length - 1)
          ) * 1000
        : parseInt(
            droneType.capacity.substring(0, droneType.capacity.length - 1)
          )
    );

    if (availableDrones.length > 0) {
      // Choose the first available drone type
      return availableDrones[0];
    }

    // No drone available with enough capacity
    return null;
  }

  // Method to add a new order dynamically
  addNewOrder(customerName, customerId, productList) {
    const newOrder = new Order(customerId, productList);
    this.orders.push(newOrder);
    return `The new order for customer ${customerName} with product ${productList}is added in queue!`;
  }
}
