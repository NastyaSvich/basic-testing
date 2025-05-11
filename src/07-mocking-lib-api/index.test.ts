import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: (fn: unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockedCreate = axios.create as jest.Mock;
  const mockedAxiosClient = {
    get: jest.fn(),
  };

  beforeEach(() => {
    mockedCreate.mockReturnValue(mockedAxiosClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';
    const relativePath = '/api';
    mockedAxiosClient.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);

    expect(mockedCreate).toHaveBeenCalledWith({
      baseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/api';

    mockedAxiosClient.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/api';
    const data = { version: '1.0.0' };

    mockedAxiosClient.get.mockResolvedValue({ data });

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(data);
  });
});
