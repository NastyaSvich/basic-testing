import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

describe('BankAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    const balance = 100;
    const account = getBankAccount(balance);
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(50);
    const account2 = getBankAccount(10);
    expect(() => account1.transfer(100, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const acc = getBankAccount(100);
    expect(() => acc.transfer(10, acc)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const balance = 100;
    const deposit = 20;
    const account = getBankAccount(balance);
    expect(account.deposit(deposit).getBalance()).toBe(balance + deposit);
  });

  test('should withdraw money', () => {
    const balance = 100;
    const withdraw = 20;
    const account = getBankAccount(balance);
    expect(account.withdraw(withdraw).getBalance()).toBe(balance - withdraw);
  });

  test('should transfer money', () => {
    const balance = 100;
    const transfer = 20;
    const account1 = getBankAccount(balance);
    const account2 = getBankAccount(balance);
    expect(account1.transfer(transfer, account2).getBalance()).toBe(
      balance - transfer,
    );
    expect(account2.getBalance()).toBe(balance + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedValue = 50;
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(fetchedValue);
    const result = await account.fetchBalance();
    expect(result).toBe(fetchedValue);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchedValue = 50;
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(fetchedValue);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(fetchedValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(0);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
