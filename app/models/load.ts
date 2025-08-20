export interface ILoad {
  id: number;
  homeId: number;
  date: string;
  data: ILoadData[];
}
export interface ICreateLoadRequest {
  homeId: number;
  roomNumber: number;
  currentKW: number;
  image?: string;
  createdOn: string;
  modifiedOn: string;
}
export interface ILoadResponse {
  homeId: number;
  roomNumber: number;
  currentKW: number;
  createdOn: string;
  modifiedOn: string;
};
export interface ILoadData {
  roomNumber: number;       // Room identifier
  roomName: string;         // Optional: Room name
  connectedLoadKW: number;  // Total load in kW
  voltage: number;          // Supply voltage (V)
  current: number;          // Current in Ampere (optional, can be calculated)
  powerFactor: number;      // Power factor (0-1)
  devices?: IDeviceLoad[];  // Optional: list of devices in room
}

export interface IDeviceLoad {
  name: string;        // Device name, e.g., "AC", "Light"
  quantity: number;    // Number of devices
  wattage: number;     // Wattage per device
  hoursUsed?: number;  // Optional: hours of usage per day
}
