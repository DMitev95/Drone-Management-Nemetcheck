class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class MapTopRightCoordinate {
  constructor(coordinates) {
    this.coordinates = new Location(coordinates.x, coordinates.y);
  }
}

class Product {
  constructor(name) {
    this.name = name;
  }
}

class Warehouse {
  constructor(name, coordinates) {
    this.name = name;
    this.location = new Location(coordinates.x, coordinates.y);
  }
}

class Customer {
  constructor(id, name, coordinates) {
    this.id = id;
    this.name = name;
    this.coordinates = new Location(coordinates.x, coordinates.y);
  }
}

class Order {
  constructor(customerId, productList) {
    this.customerId = customerId;
    this.productList = productList;
  }
}

class DroneType {
  constructor(capacity, consumption) {
    this.totalCapacity = capacity;
    this.capacity = capacity;
    this.consumption = consumption;
  }
}

class DeliveryPlanner {
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
      (drone) => new DroneType(drone.capacity, drone.consumption)
    );
  }

  calculateTotalTime() {
    let totalTime = 0;
    const pickupTime = 5; // Assuming 5 minutes for picking up the order
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

    //Display the result
    console.log(`Total delivery time: ${Math.round(totalTime)} minutes`);
    console.log(`Total drones will be needed: ${totalDronesRequired} drones`);
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
            droneType.capacity.substring(0, droneType.consumption.length - 1)
          ) * 1000
        : Number(
            droneType.capacity.substring(0, droneType.consumption.length - 1)
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

const input = {
  "map-top-right-coordinate": { x: 280, y: 280 },
  products: [
    "tomatoes",
    "cucumber",
    "cheese",
    "milk",
    "ham",
    "eggs",
    "bananas",
    "carrots",
    "bread",
    "onion",
  ],
  warehouses: [
    { x: 100, y: 100, name: "Left warehouse" },
    { x: 200, y: 200, name: "Right warehouse" },
  ],
  customers: [
    { id: 1, name: "John Stocks", coordinates: { x: 10, y: 10 } },
    { id: 2, name: "Alfred Derrick", coordinates: { x: 213, y: 187 } },
    { id: 3, name: "Richard Brune", coordinates: { x: 108, y: 15 } },
    { id: 4, name: "Mitko", coordinates: { x: 25, y: 3 } },
  ],
  orders: [
    {
      customerId: 1,
      productList: { tomatoes: 5, cucumber: 5, cheese: 1, milk: 2 },
    },
    {
      customerId: 1,
      productList: { eggs: 10, cucumber: 2, cheese: 1, ham: 2 },
    },

    {
      customerId: 2,
      productList: {
        eggs: 10,
        tomatoes: 2,
        bananas: 5,
        carrots: 15,
        bread: 2,
        onion: 6,
      },
    },
    {
      customerId: 3,
      productList: { eggs: 5, cucumber: 5, cheese: 1, tomatoes: 2 },
    },
    {
      customerId: 3,
      productList: { eggs: 10, tomatoes: 2, ham: 1, bananas: 2 },
    },
    {
      customerId: 2,
      productList: {
        bananas: 10,
        carrots: 2,
        onion: 5,
        cucumber: 15,
        cheese: 2,
        bread: 6,
      },
    },
  ],
  typesOfDrones: [
    { capacity: "500W", consumption: "1W" },
    { capacity: "1kW", consumption: "3W" },
    { capacity: "2kW", consumption: "5W" },
  ],
};

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

// Dynamically add a new order during the simulation
//This is not right!!!
setTimeout(() => {
  deliveryPlanner.addNewOrder(4, { eggs: 8, tomatoes: 3, bread: 2 });
}, 3000); // Add a new order after 5 seconds

// async () => ({})();
// // Create DeliveryPlanner instance
// const deliveryPlanner = new DeliveryPlanner(
//   input["map-top-right-coordinate"],
//   input.products,
//   input.warehouses,
//   input.customers,
//   input.orders,
//   input.typesOfDrones
// );

// // Calculate total delivery time and total drones
// const totalDeliveryTimeAndDrones = deliveryPlanner.calculateTotalTime();

// // Display the result
// console.log(`Total delivery time: ${totalDeliveryTimeAndDrones[1]} minutes`);
// console.log(
//   `Total drones will be needed: ${totalDeliveryTimeAndDrones[0]} drones`
// );
