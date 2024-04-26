export class Order {
  constructor(
    customerId,
    productList,
    distance = 0,
    droneType = "",
    inProgress = false
  ) {
    this.time = 0;
    this.timeToDeliver = 0;
    this.customerId = customerId;
    this.productList = productList;
    this.distance = distance;
    this.droneType = droneType;
    this.inProgress = inProgress;
  }

  setDistance(distance) {
    this.timeToDeliver = Math.ceil(distance);
    this.distance = Math.ceil(distance);
  }
}
