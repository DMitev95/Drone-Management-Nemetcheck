import { Location } from "./Location.js";

class MapTopRightCoordinate {
  constructor(coordinates) {
    this.coordinates = new Location(coordinates.x, coordinates.y);
  }
}
