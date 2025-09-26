import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  let pipe: StatusPipe;

  beforeEach(() => {
    pipe = new StatusPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "confirmed" to "Confirmé"', () => {
    const result = pipe.transform('confirmed');
    expect(result).toBe('Confirmé');
  });

  it('should transform "cancelled" to "Annulé"', () => {
    const result = pipe.transform('cancelled');
    expect(result).toBe('Annulé');
  });

  it('should return empty string for null value', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should return empty string for undefined value', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });

  // Test all valid cases at once
  it('should transform all valid status values correctly', () => {
    const testCases: {
      input: 'confirmed' | 'cancelled' | null | undefined;
      expected: string;
    }[] = [
      { input: 'confirmed', expected: 'Confirmé' },
      { input: 'cancelled', expected: 'Annulé' },
      { input: null, expected: '' },
      { input: undefined, expected: '' },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(pipe.transform(input)).toBe(expected);
    });
  });
});
