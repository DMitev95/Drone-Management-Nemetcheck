export class deliveryPlannerUtility {
  //Calculate distance between warehouse and customer in miliseconds
  calculateDistance(wareHouseLocation, customerLocation) {
    return Math.sqrt(
      Math.pow(customerLocation.x - wareHouseLocation.x, 2) +
        Math.pow(customerLocation.y - wareHouseLocation.y, 2)
    );
  }

  //Check for coordiantes are inside the map
  //I didnt have time for this to implement it
  isOutsideMapBounds(coordinates, mapTopRightCoordinate) {
    return (
      this.x < 0 ||
      this.x > mapTopRightCoordinate.x ||
      this.y < 0 ||
      this.y > mapTopRightCoordinate.y
    );
  }

  //Calculate how mcuh drones will be needed
  calculateDroneNeeded(orders, drones, deliveryTimeFrameInMinutes, pickupTime) {
    let timeForLoadingMin = 5;
    let totalTime = 0;
    let dronesNedded = 1;
    let totalDrones = numberOfDrones();
    return totalDrones;

    //Check how much drones needed
    function numberOfDrones() {
      for (let j = 0; j < orders.length; j++) {
        //Calculate working min per day
        let workingDayMinPerDrone = deliveryTimeFrameInMinutes * dronesNedded;

        let currDrone = drones.find(
          (drone) => drone.totalCapacity === orders[j].droneType
        );

        let indexOfDrone = drones.findIndex((drone) => drone === currDrone);

        let orderTotalDistance = orders[j].distance * 2;

        let calculateCapacityForTrip = currDrone.capacity - orderTotalDistance;

        drones[indexOfDrone].capacity = currDrone.capacity;
        //If capacity for the trip si enought - add the time for traveling + the time for loading
        if (calculateCapacityForTrip <= orderTotalDistance) {
          totalTime += orderTotalDistance + pickupTime;
        } else {
          //If there is not enought capacity I am adding and time for recharging
          totalTime +=
            orderTotalDistance +
            timeForLoadingMin +
            currDrone.dronRecharge(currDrone.capacity);
        }

        //If total time is enought returning total drones I need to compleate all orders for the day
        //If not I am adding one more dron and calculating again
        if (totalTime > workingDayMinPerDrone) {
          dronesNedded++;
          totalTime = 0;
          numberOfDrones();
          break;
        }
      }
      drones.forEach((drone) => {
        if (drone.capacity !== drone.totalCapacity) {
          drone.capacity = drone.totalCapacity;
        }
      });
      return dronesNedded;
    }
  }

  printingTheOrderStatus(customerName, status) {
    console.log(`Order for ${customerName} curretly is ${status}.`);
  }

  //Testing to simulate delivering with recharging
  // dronesDelivering(drones, orders, _customers) {
  //   const status = ["free", "picking order", "deliver", "return", "recharging"];

  //   const customers = _customers;

  //   // check the orders min by min if the order is not in progress and there is free drone
  //   // he will take the order and go to complete it
  //   for (let i = 0; i < orders.length; i++) {
  //     //select current order
  //     let currentOrder = orders[i];
  //     let dronesForOrder = drones.filter(
  //       (drone) => drone.totalCapacity === orders[i].droneType
  //     );
  //     for (let j = 0; j < dronesForOrder.length; j++) {
  //       //select drone
  //       let curentDrone = dronesForOrder[j];

  //       //if the curent order is in progress check:
  //       if (currentOrder.inProgress) {
  //         switch (curentDrone.status) {
  //           //Drone is delivering
  //           case status[1]:
  //             //time is 0 the order is departure to deliver the order
  //             if (curentDrone.timeToCompleteOrder <= 0) {
  //               curentDrone.timeToCompleteOrder = curentDrone.order.distance;
  //               curentDrone.status = status[2];
  //               console.log(`The drone is delivery products to ${
  //                 customers.find((cust) => cust.id === currentOrder.customerId)
  //                   .name
  //               }.
  //                               \nThe time to delivery will be in next ${
  //                                 curentDrone.timeToComplete
  //                               }min.`);
  //               console.log("------------------");
  //             } else {
  //               //time is passing
  //               curentDrone.timeToCompleteOrder--;
  //             }
  //             break;

  //           //drone delivered the order and it`s going back to the warehouse
  //           case status[2]:
  //             if (curentDrone.timeToComplete <= 0) {
  //               curentDrone.timeToComplete = curentDrone.order.distance;
  //               curentDrone.status = status[3];
  //               console.log(`Delivery completed. The drone is returning to warehouse.
  //                               \nTime to return ${curentDrone.timeToComplete}.`);
  //               console.log("------------------");
  //             } else {
  //               //time is passing
  //               curentDrone.timeToCompleteOrder--;
  //               curentDrone.capacity -= curentDrone.consumption;
  //             }

  //             break;

  //           //the drone is back to base and reset for new order
  //           case status[3]:
  //             if (curentDrone.timeToCompleteOrder <= 0) {
  //               curentDrone.status = status[0];
  //               curentDrone.order = null;
  //               console.log(`Drone is back to base and ready for new order!`);
  //               console.log("------------------");
  //             } else {
  //               //time is passing
  //               curentDrone.timeToCompleteOrder--;
  //               curentDrone.capacity -= curentDrone.consumption;
  //             }
  //             break;

  //           //recharging completed
  //           case status[4]:
  //             if (curentDrone.timeToCompleteOrder <= 0) {
  //               curentDrone.status = status[0];
  //               curentDrone.capacity = curentDrone.totalCapacity;
  //             }
  //             break;

  //           default:
  //             break;
  //         }
  //       } else if (curentDrone.order === null) {
  //         //check if the capacity of the drone is enought for the voyage if no recharg
  //         if (
  //           curentDrone.capacity <
  //           currentOrder.distance * curentDrone.consumption
  //         ) {
  //           curentDrone.status = status[4];
  //           curentDrone.timeToCompleteOrder = curentDrone.DronRecharge(
  //             curentDrone.capacity
  //           );
  //           continue;
  //         } else {
  //           //the drone is picking up a order to deliver to a client
  //           curentDrone.order = currentOrder;
  //           curentDrone.timeToCompleteOrder = pickupTime;
  //           curentDrone.status = status[1];
  //           currentOrder.inProgress = true;
  //           console.log(`One drone is prepearing the order for a client ${
  //             customers.find((cust) => cust.id === currentOrder.customerId).name
  //           }.
  //                       \nThe products to delivery :`);
  //           console.log("------------------");
  //           this.formatDataForAOrder(currentOrder.productList);
  //         }
  //       }
  //     }
  //   }
  // }
}
