import { Location } from "./Location.js";

export class Warehouse {
  constructor(name, coordinates) {
    this.name = name;
    this.location = new Location(coordinates.x, coordinates.y);
  }
}
