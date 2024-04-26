function getFormatedCapacity(capacity) {
  return capacity.includes("kW")
    ? parseInt(capacity.substring(0, capacity.length - 2)) * 1000
    : parseInt(capacity.substring(0, capacity.length - 1));
}

//Formating consumptio
function getFormatedConsumption(consumption) {
  return parseInt(consumption.substring(0, consumption.length - 1));
}

export { getFormatedCapacity, getFormatedConsumption };
