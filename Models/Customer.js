import { Location } from "./Location.js";

export class Customer {
  constructor(id, name, coordinates) {
    this.id = id;
    this.name = name;
    this.coordinates = new Location(coordinates.x, coordinates.y);
  }
}
