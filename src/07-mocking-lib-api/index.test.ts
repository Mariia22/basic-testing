import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.setTimeout(30000);
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const relativePath = '/users';
  const mockResponse = { data: 'result' };
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const mockAxiosCreate = axios.create as jest.Mock;
  const mockAxiosInstance = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAxiosCreate.mockReturnValue(mockAxiosInstance);
    mockAxiosInstance.get.mockResolvedValue(mockResponse);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: baseUrl,
    });
  });

  test('should perform request to correct provided url', async () => {
    jest.advanceTimersByTime(THROTTLE_TIME);
    await throttledGetDataFromApi(relativePath);
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    jest.advanceTimersByTime(THROTTLE_TIME);
    const result = await throttledGetDataFromApi(relativePath);
    expect(result).toBe(mockResponse.data);
  });
});
