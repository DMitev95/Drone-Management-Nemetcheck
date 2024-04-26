import {
  getFormatedCapacity,
  getFormatedConsumption,
} from "./DronesUtility.js";

export class Drone {
  constructor(
    id,
    capacity,
    consumption,
    status = "free",
    timeForDeliveryOrder = 0,
    order = null
  ) {
    //capacity move to utility
    this.id = id;
    this.totalCapacity = getFormatedCapacity(capacity);
    this.capacity = getFormatedCapacity(capacity);
    this.consumption = getFormatedConsumption(consumption);
    this.status = status;
    this.timeForDeliveryOrder = timeForDeliveryOrder;
    this.order = order;
  }

  dronRecharge(droneCapacity) {
    let batteryProcent =
      ((this.totalCapacity - droneCapacity) / this.totalCapacity) * 100;
    this.capacity = this.totalCapacity;
    return Math.ceil((this.rechargingTime * batteryProcent) / 100);
  }
}
