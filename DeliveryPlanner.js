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
      (order) => new Order(order.customerId, order.productList)
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
    const deliveryTimeFrameInMinutes = 12 * 60; // Total delivery time per day in minutes

    this.orders.forEach((order) => {
      const nearestWarehouse = this.findNearestWarehouse(order);

      const travelTime = this.calculateDistance(
        nearestWarehouse.location,
        this.customers.find((customer) => customer.id === order.customerId)
          .coordinates
      );

      if (order.customerId === this.orders[this.orders.length - 1].customerId) {
        if (this.chooseDroneType(travelTime) !== null) {
          const choosenDrone = this.chooseDroneType(travelTime);
          totalTime = totalTime + travelTime + pickupTime;
          console.log(
            `${Math.round(travelTime + pickupTime)} to deliver order from ${
              this.customers.find(
                (customer) => customer.id === order.customerId
              ).name
            }, with drone ${choosenDrone.capacity}!`
          );
        } else {
          console.log("Dont have avable drones at the moment!");
        }
      } else {
        //TO DO
        if (this.chooseDroneType(travelTime) !== null) {
          const choosenDrone = this.chooseDroneType(travelTime);
          totalTime = totalTime + travelTime + pickupTime + travelTime;
          console.log(
            `${Math.round(
              travelTime + pickupTime
            )} minutes to deliver order from ${
              this.customers.find(
                (customer) => customer.id === order.customerId
              ).name
            }, with drone ${choosenDrone.capacity}!`
          );
        } else {
          console.log("Dont have avable drones at the moment!");
        }
      }
    });

    // Calculate the number of drones needed
    const totalDronesRequired = Math.ceil(
      (deliveryTimeFrameInMinutes / totalTime) * this.orders.length
    );
    const averageTimeForDelivery = Math.ceil(totalTime / this.orders.length);

    //Display the result
    console.log(
      `Averige time for delivery: ${averageTimeForDelivery} minutes!`
    );
    console.log(`Total delivery time: ${Math.round(totalTime)} minutes!`);
    console.log(`Total drones will be needed: ${totalDronesRequired} drones!`);
    // return [totalDronesRequired, Math.round(totalTime)];
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
    // Choose a drone type based on the travel time
    const availableDrones = this.typesOfDrones.filter((droneType) =>
      travelTime *
        Number(
          droneType.consumption.substring(0, droneType.consumption.length - 1)
        ) <=
      droneType.capacity.includes("kW")
        ? Number(
            droneType.capacity.substring(0, droneType.capacity.length - 1)
          ) * 1000
        : Number(droneType.capacity.substring(0, droneType.capacity.length - 1))
    );

    if (availableDrones.length > 0) {
      // Choose the first available drone type
      return availableDrones[0];
    }

    // No drone available with enough capacity
    return null;
  }

  // Method to add a new order dynamically
  addNewOrder(customerId, productList) {
    const newOrder = new Order(customerId, productList);
    this.orders.push(newOrder);
    console.log(
      `New order added for Customer ${
        this.customers.find((customer) => customer.id === customerId).name
      }`
    );
  }
}
