import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import path from 'path';
import * as fs from 'fs';
import fsPromises from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spyOnTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 1000);
    expect(spyOnTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spyOnSetInterval = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 1000);
    expect(spyOnSetInterval).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    jest.advanceTimersByTime(3000);

    expect(callback).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockJoin = path.join as jest.Mock;
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockReadFile = fsPromises.readFile as jest.Mock;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'file.txt';
    const absolutePath = `/path/${pathToFile}`;

    mockJoin.mockReturnValue(absolutePath);
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(mockJoin).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'file.txt';
    const absolutePath = `/path/${pathToFile}`;

    mockJoin.mockReturnValue(absolutePath);
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'file.txt';
    const absolutePath = `/path/${pathToFile}`;
    const fileContent = 'Hello!';

    mockJoin.mockReturnValue(absolutePath);
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
