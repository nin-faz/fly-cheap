import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyBookingsComponent } from './my-bookings';
import { MyBookingsService } from '../services/my-bookings';
import { NotificationService } from '../../../shared/services/notification';
import { Booking } from '../../booking/models/booking';
import { User } from '../../user/models/user';
import { Flight } from '../../flights/models/flight';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('MyBookingsComponent', () => {
  let component: MyBookingsComponent;
  let fixture: ComponentFixture<MyBookingsComponent>;
  let myBookingsServiceSpy: jasmine.SpyObj<MyBookingsService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

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
    airline: 'Air France',
    flightNumber: 'AF123',
    stops: 0,
  };

  const mockBookings: Booking[] = [
    {
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
    },
    {
      id: 'booking-2',
      user: mockUser,
      flight: { ...mockFlight, id: 'flight-2' },
      passenger: {
        name: 'Jane',
        surname: 'Doe',
        type: 'Adulte',
        birthDate: '1992-05-15',
      },
      extras: {
        luggage: false,
        extraSeat: true,
        meal: false,
      },
      totalPrice: 550,
      createdAt: new Date('2024-01-05T14:30:00Z'),
      status: 'cancelled',
    },
  ];

  beforeEach(async () => {
    const myBookingsSpy = jasmine.createSpyObj('MyBookingsService', [
      'getMyBookings',
      'cancelBooking',
      'deleteMyBooking',
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [MyBookingsComponent],
      providers: [
        { provide: MyBookingsService, useValue: myBookingsSpy },
        { provide: NotificationService, useValue: notificationSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookingsComponent);
    component = fixture.componentInstance;
    myBookingsServiceSpy = TestBed.inject(MyBookingsService) as jasmine.SpyObj<MyBookingsService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load bookings on initialization', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve(mockBookings));

      component.ngOnInit();
      await fixture.whenStable();

      expect(myBookingsServiceSpy.getMyBookings).toHaveBeenCalled();
      expect(component.bookings).toEqual(mockBookings);
    });
  });

  describe('loadBookings', () => {
    it('should call myBookingsService.getMyBookings and update bookings', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve(mockBookings));

      await component.loadBookings();

      expect(myBookingsServiceSpy.getMyBookings).toHaveBeenCalled();
      expect(component.bookings).toEqual(mockBookings);
    });

    it('should handle empty bookings array', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([]));

      await component.loadBookings();

      expect(myBookingsServiceSpy.getMyBookings).toHaveBeenCalled();
      expect(component.bookings).toEqual([]);
    });
  });

  describe('cancelBooking', () => {
    beforeEach(() => {
      component.bookings = mockBookings;
    });

    it('should cancel booking successfully and show success message', async () => {
      myBookingsServiceSpy.cancelBooking.and.returnValue(Promise.resolve(true));
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve(mockBookings));

      await component.cancelBooking('booking-1');

      expect(myBookingsServiceSpy.cancelBooking).toHaveBeenCalledWith('booking-1');
      expect(myBookingsServiceSpy.getMyBookings).toHaveBeenCalled();
      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
        'Réservation annulée avec succès',
      );
      expect(notificationServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should show error message when cancellation fails', async () => {
      myBookingsServiceSpy.cancelBooking.and.returnValue(Promise.resolve(false));

      await component.cancelBooking('booking-1');

      expect(myBookingsServiceSpy.cancelBooking).toHaveBeenCalledWith('booking-1');
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        "Erreur lors de l'annulation de la réservation",
      );
      expect(notificationServiceSpy.showSuccess).not.toHaveBeenCalled();
    });
  });

  describe('deleteBooking', () => {
    beforeEach(() => {
      component.bookings = mockBookings;
    });

    it('should delete booking successfully when user confirms', async () => {
      spyOn(window, 'confirm').and.returnValue(true);
      myBookingsServiceSpy.deleteMyBooking.and.returnValue(Promise.resolve(true));
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([]));

      await component.deleteBooking('booking-2');

      expect(window.confirm).toHaveBeenCalledWith(
        'Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action est irréversible.',
      );
      expect(myBookingsServiceSpy.deleteMyBooking).toHaveBeenCalledWith('booking-2');
      expect(myBookingsServiceSpy.getMyBookings).toHaveBeenCalled();
      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
        'Réservation supprimée définitivement',
      );
      expect(notificationServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should show error message when deletion fails', async () => {
      spyOn(window, 'confirm').and.returnValue(true);
      myBookingsServiceSpy.deleteMyBooking.and.returnValue(Promise.resolve(false));

      await component.deleteBooking('booking-2');

      expect(window.confirm).toHaveBeenCalled();
      expect(myBookingsServiceSpy.deleteMyBooking).toHaveBeenCalledWith('booking-2');
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Erreur lors de la suppression de la réservation',
      );
      expect(notificationServiceSpy.showSuccess).not.toHaveBeenCalled();
    });

    it('should not delete booking when user cancels confirmation', async () => {
      spyOn(window, 'confirm').and.returnValue(false);

      await component.deleteBooking('booking-2');

      expect(window.confirm).toHaveBeenCalled();
      expect(myBookingsServiceSpy.deleteMyBooking).not.toHaveBeenCalled();
      expect(notificationServiceSpy.showSuccess).not.toHaveBeenCalled();
      expect(notificationServiceSpy.showError).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should display bookings when bookings array is not empty', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve(mockBookings));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const bookingCards = fixture.debugElement.queryAll(By.css('mat-card'));
      // We expect at least the booking cards (plus potential empty state card)
      expect(bookingCards.length).toBeGreaterThan(0);
    });

    it('should display empty state when no bookings', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const emptyStateText = fixture.debugElement.query(By.css('h2'));
      expect(emptyStateText?.nativeElement.textContent).toContain('Aucune réservation trouvée');
    });

    it('should display booking information correctly', async () => {
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([mockBookings[0]]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Air France');
      expect(compiled.textContent).toContain('AF123');
      expect(compiled.textContent).toContain('Paris');
      expect(compiled.textContent).toContain('New York');
      expect(compiled.textContent).toContain('John');
      expect(compiled.textContent).toContain('Doe');
    });

    it('should show cancel button for confirmed bookings', async () => {
      const confirmedBooking = { ...mockBookings[0], status: 'confirmed' as const };
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([confirmedBooking]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(cancelButton?.nativeElement.textContent.trim()).toContain('Annuler la réservation');
    });

    it('should show delete button for cancelled bookings', async () => {
      const cancelledBooking = { ...mockBookings[1], status: 'cancelled' as const };
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([cancelledBooking]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(deleteButton?.nativeElement.textContent.trim()).toContain('Supprimer définitivement');
    });

    it('should display extras when they exist', async () => {
      const bookingWithExtras = {
        ...mockBookings[0],
        extras: { luggage: true, extraSeat: true, meal: true },
      };
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([bookingWithExtras]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Options incluses');
      expect(compiled.textContent).toContain('Bagage en soute');
      expect(compiled.textContent).toContain('Siège avec espace supplémentaire');
      expect(compiled.textContent).toContain('Repas à bord');
    });
  });

  describe('Button interactions', () => {
    it('should call cancelBooking when cancel button is clicked', async () => {
      const confirmedBooking = { ...mockBookings[0], status: 'confirmed' as const };
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([confirmedBooking]));
      myBookingsServiceSpy.cancelBooking.and.returnValue(Promise.resolve(true));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      spyOn(component, 'cancelBooking');

      const cancelButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      cancelButton.nativeElement.click();

      expect(component.cancelBooking).toHaveBeenCalledWith('booking-1');
    });

    it('should call deleteBooking when delete button is clicked', async () => {
      const cancelledBooking = { ...mockBookings[1], status: 'cancelled' as const };
      myBookingsServiceSpy.getMyBookings.and.returnValue(Promise.resolve([cancelledBooking]));

      component.ngOnInit();
      await fixture.whenStable();
      fixture.detectChanges();

      spyOn(component, 'deleteBooking');

      const deleteButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      deleteButton.nativeElement.click();

      expect(component.deleteBooking).toHaveBeenCalledWith('booking-2');
    });
  });
});
