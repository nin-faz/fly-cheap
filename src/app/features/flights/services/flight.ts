import { Injectable } from '@angular/core';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly flights: Flight[] = [
    {
      id: '1',
      departure: 'Paris',
      destination: 'Budapest',
      departureAirport: 'CDG',
      destinationAirport: 'BUD',
      date: 'Lun 16 Sep 2025',
      departureTime: '06:30',
      arrivalTime: '09:15',
      duration: '2h 45m',
      price: 29,
      airline: 'Wizz Air',
      flightNumber: 'W6 1234',
      stops: 0,
    },
    {
      id: '2',
      departure: 'Lyon',
      destination: 'Prague',
      departureAirport: 'LYS',
      destinationAirport: 'PRG',
      date: 'Mar 17 Sep 2025',
      departureTime: '14:20',
      arrivalTime: '16:45',
      duration: '2h 25m',
      price: 35,
      airline: 'easyJet',
      flightNumber: 'U2 5678',
      stops: 0,
    },
    {
      id: '3',
      departure: 'Marseille',
      destination: 'Cracovie',
      departureAirport: 'MRS',
      destinationAirport: 'KRK',
      date: 'Mer 18 Sep 2025',
      departureTime: '07:45',
      arrivalTime: '11:30',
      duration: '3h 45m',
      price: 42,
      airline: 'Ryanair',
      flightNumber: 'FR 9012',
      stops: 1,
    },
    {
      id: '4',
      departure: 'Nice',
      destination: 'Porto',
      departureAirport: 'NCE',
      destinationAirport: 'OPO',
      date: 'Jeu 19 Sep 2025',
      departureTime: '10:15',
      arrivalTime: '12:05',
      duration: '1h 50m',
      price: 38,
      airline: 'Transavia',
      flightNumber: 'TO 3456',
      stops: 0,
    },
    {
      id: '5',
      departure: 'Paris',
      destination: 'Athènes',
      departureAirport: 'ORY',
      destinationAirport: 'ATH',
      date: 'Ven 20 Sep 2025',
      departureTime: '15:30',
      arrivalTime: '19:45',
      duration: '3h 15m',
      price: 55,
      airline: 'Aegean',
      flightNumber: 'A3 7890',
      stops: 0,
    },
  ];

  getFlights(): Flight[] {
    return [...this.flights];
  }

  searchFlights(criteria: {
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  }): Flight[] {
    return this.flights.filter(
      (f) =>
        f.departure.toLowerCase().includes(criteria.departure.toLowerCase()) &&
        f.destination.toLowerCase().includes(criteria.destination.toLowerCase()),
    );
  }

  // FlightService
  filterFlights(flights: Flight[], filterBy: string): Flight[] {
    return flights.filter((f) => {
      switch (filterBy) {
        case 'direct':
          return f.stops === 0;
        case 'wizz':
          return f.airline === 'Wizz Air';
        case 'easyjet':
          return f.airline === 'easyJet';
        case 'ryanair':
          return f.airline === 'Ryanair';
        case 'transavia':
          return f.airline === 'Transavia';
        case 'aegean':
          return f.airline === 'Aegean';
        case 'all':
        default:
          return true;
      }
    });
  }

  sortFlights(flights: Flight[], sortBy: string): Flight[] {
    const result = [...flights];
    switch (sortBy) {
      case 'price':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        result.sort((a, b) => this.parseDuration(a.duration) - this.parseDuration(b.duration));
        break;
      case 'departure':
        result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
    }
    return result;
  }

  private parseDuration(duration: string): number {
    const regex = /(\d+)h\s*(\d+)?m?/;

    const match = regex.exec(duration);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  }
}
