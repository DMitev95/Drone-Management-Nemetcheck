export class Order {
  constructor(customerId, status, productList) {
    this.customerId = customerId;
    this.status = status;
    this.productList = productList;
  }
}
