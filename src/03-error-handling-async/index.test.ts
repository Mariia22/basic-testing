import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

jest.setTimeout(30000);

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    await expect(resolveValue(5)).resolves.toBe(5);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('throw new error')).toThrow('throw new error');
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(() => rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(() => rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
