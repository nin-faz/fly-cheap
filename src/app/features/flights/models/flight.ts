export interface Flight {
  id: string;
  departure: string;
  destination: string;
  departureAirport: string;
  destinationAirport: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  airline: string;
  flightNumber: string;
  stops: number;
}
