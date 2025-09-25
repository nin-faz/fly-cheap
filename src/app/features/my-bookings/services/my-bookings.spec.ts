import { TestBed } from '@angular/core/testing';
import { MyBookingsService } from './my-bookings';
import { AuthService } from '../../auth/services/auth';
import { BookingService } from '../../booking/services/booking';
import { Booking } from '../../booking/models/booking';
import { User } from '../../user/models/user';
import { Flight } from '../../flights/models/flight';

describe('MyBookingsService', () => {
  let service: MyBookingsService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;

  // Mock data
  const mockUser: User = {
    id: 1,
    name: 'John',
    email: 'john.doe@example.com',
    phone: '0123456789',
    role: 'user',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockFlight: Flight = {
    id: 'flight-1',
    departure: 'Paris',
    destination: 'New York',
    departureAirport: 'CDG',
    destinationAirport: 'JFK',
    date: '2024-01-15',
    departureTime: '10:00',
    arrivalTime: '18:00',
    duration: '8h 00m',
    price: 500,
    airline: 'Air Test',
    flightNumber: 'AT123',
    stops: 0,
  };

  const mockBooking: Booking = {
    id: 'booking-1',
    user: mockUser,
    flight: mockFlight,
    passenger: {
      name: 'John',
      surname: 'Doe',
      type: 'Adulte',
      birthDate: '1990-01-01',
    },
    extras: {
      luggage: true,
      extraSeat: false,
      meal: true,
    },
    totalPrice: 650,
    createdAt: new Date('2024-01-10T10:00:00Z'),
    status: 'confirmed',
  };

  const mockBookings: Booking[] = [
    mockBooking,
    {
      ...mockBooking,
      id: 'booking-2',
      user: { ...mockUser, id: 2 },
      status: 'cancelled',
    },
  ];

  beforeEach(() => {
    // Creation des spies (mocks) for dependent services
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const bookingSpy = jasmine.createSpyObj('BookingService', [
      'getAllBookings',
      'updateBooking',
      'deleteBooking',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MyBookingsService,
        { provide: AuthService, useValue: authSpy },
        { provide: BookingService, useValue: bookingSpy },
      ],
    });

    service = TestBed.inject(MyBookingsService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    bookingServiceSpy = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMyBookings', () => {
    it('should return bookings for the current user', async () => {
      // Arrange
      authServiceSpy.getCurrentUser.and.returnValue(mockUser);
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.getMyBookings();

      // Assert
      expect(result).toEqual([mockBooking]);
      expect(result.length).toBe(1);
      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
      expect(bookingServiceSpy.getAllBookings).toHaveBeenCalled();
    });

    it('should return empty array when user has no bookings', async () => {
      // Arrange
      const userWithoutBookings = { ...mockUser, id: 3 };
      authServiceSpy.getCurrentUser.and.returnValue(userWithoutBookings);
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.getMyBookings();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array when current user is null', async () => {
      // Arrange
      authServiceSpy.getCurrentUser.and.returnValue(null);
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.getMyBookings();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('getBookingById', () => {
    it('should return booking when found', async () => {
      // Arrange
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.getBookingById('booking-1');

      // Assert
      expect(result).toEqual(mockBooking);
      expect(bookingServiceSpy.getAllBookings).toHaveBeenCalled();
    });

    it('should return undefined when booking not found', async () => {
      // Arrange
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.getBookingById('non-existent-id');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a confirmed booking successfully', async () => {
      // Arrange
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));
      bookingServiceSpy.updateBooking.and.returnValue(
        Promise.resolve({ ...mockBooking, status: 'cancelled' }),
      );

      // Act
      const result = await service.cancelBooking('booking-1');

      // Assert
      expect(result).toBe(true);
      expect(bookingServiceSpy.updateBooking).toHaveBeenCalledWith('booking-1', {
        ...mockBooking,
        status: 'cancelled',
      });
    });

    it('should not cancel an already cancelled booking', async () => {
      // Arrange
      const cancelledBooking = { ...mockBooking, status: 'cancelled' as const };
      const bookingsWithCancelled = [cancelledBooking];
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(bookingsWithCancelled));

      // Act
      const result = await service.cancelBooking('booking-1');

      // Assert
      expect(result).toBe(false);
      expect(bookingServiceSpy.updateBooking).not.toHaveBeenCalled();
    });

    it('should return false when booking not found', async () => {
      // Arrange
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));

      // Act
      const result = await service.cancelBooking('non-existent-id');

      // Assert
      expect(result).toBe(false);
      expect(bookingServiceSpy.updateBooking).not.toHaveBeenCalled();
    });

    it('should return false when update booking fails', async () => {
      // Arrange
      bookingServiceSpy.getAllBookings.and.returnValue(Promise.resolve(mockBookings));
      bookingServiceSpy.updateBooking.and.returnValue(Promise.resolve(undefined));

      // Act
      const result = await service.cancelBooking('booking-1');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('deleteMyBooking', () => {
    it('should delete booking successfully', async () => {
      // Arrange
      bookingServiceSpy.deleteBooking.and.returnValue(Promise.resolve(true));

      // Act
      const result = await service.deleteMyBooking('booking-1');

      // Assert
      expect(result).toBe(true);
      expect(bookingServiceSpy.deleteBooking).toHaveBeenCalledWith('booking-1');
    });

    it('should return false when delete fails', async () => {
      // Arrange
      bookingServiceSpy.deleteBooking.and.returnValue(Promise.resolve(false));

      // Act
      const result = await service.deleteMyBooking('booking-1');

      // Assert
      expect(result).toBe(false);
      expect(bookingServiceSpy.deleteBooking).toHaveBeenCalledWith('booking-1');
    });
  });
});
