import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.setTimeout(30000);
jest.mock('lodash', () => ({
  random: jest.fn(),
}));
describe('BankAccount', () => {
  const initialBalance = 5000;
  let account: BankAccount;
  beforeEach(() => {
    account = getBankAccount(initialBalance);
  });
  test('should create account with initial balance', () => {
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawalAmount = 15000;
    expect(() => account.withdraw(withdrawalAmount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.withdraw(withdrawalAmount)).toThrow(
      `Insufficient funds: cannot withdraw more than ${account.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const transformAmount = 15000;
    const accountTo = new BankAccount(initialBalance);
    expect(() => account.transfer(transformAmount, accountTo)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.transfer(transformAmount, accountTo)).toThrow(
      `Insufficient funds: cannot withdraw more than ${account.getBalance()}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transformAmount = 1500;
    expect(() => account.transfer(transformAmount, account)).toThrow(
      TransferFailedError,
    );
    expect(() => account.transfer(transformAmount, account)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const depositAmount = 1500;
    account.deposit(depositAmount);
    expect(account.getBalance()).toBe(6500);
  });

  test('should withdraw money', () => {
    const withdrawalAmount = 1000;
    account.withdraw(withdrawalAmount);
    expect(account.getBalance()).toBe(4000);
  });

  test('should transfer money', () => {
    const transferAmount = 1000;
    const accountTo = new BankAccount(initialBalance);
    account.transfer(transferAmount, accountTo);
    expect(account.getBalance()).toBe(4000);
    expect(accountTo.getBalance()).toBe(6000);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
