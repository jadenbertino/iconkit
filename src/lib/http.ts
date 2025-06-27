import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios'
import axios, { AxiosError } from 'axios'
import type { IAxiosRetryConfig } from 'axios-retry'
import axiosRetry from 'axios-retry'
import { serializeError } from 'serialize-error'
import { z } from 'zod'

type ErrorType =
  | 'AUTH_CLIENT_ERROR'
  | 'AUTH_HEADERS_NULL'
  | 'REQUEST_FAILED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'

class HttpError extends Error {
  statusCode: number
  errorType: ErrorType;
  [key: string]: unknown

  constructor({
    statusCode,
    message,
    errorType,
    ...extraProperties
  }: {
    statusCode: number
    message: string
    errorType: ErrorType
    [key: string]: unknown
  }) {
    super(message)
    this.statusCode = statusCode
    this.errorType = errorType
    Object.assign(this, extraProperties)
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type HttpConfig<T extends z.ZodType | undefined = undefined> =
  AxiosRequestConfig & {
    url: string
    method: HttpMethod
    responseSchema?: T
  }

type ConvenienceHttpConfig<T extends z.ZodType | undefined = undefined> = Omit<
  HttpConfig<T>,
  'method'
>

type ResponseType<T extends z.ZodType | undefined> = T extends z.ZodType
  ? z.infer<T>
  : unknown

/**
 * Request client that provides HTTP methods with response validation.
 * Requires an axios instance to be provided in the constructor.
 * Throws a `HttpError` on axios or zod validation failure.
 */
class HttpClient {
  // public in case user wants to attach interceptors
  public axiosInstance: AxiosInstance

  constructor(axiosConfig?: CreateAxiosDefaults) {
    const axiosInstance = axios.create({
      timeout: 15 * 1000, // default to 15 second timeout
      ...axiosConfig,
    })
    attachRetryLogic(axiosInstance)
    this.axiosInstance = axiosInstance
  }

  /**
   * Makes request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async request<T extends z.ZodType | undefined = undefined>({
    responseSchema = z.unknown(),
    ...axiosConfig
  }: HttpConfig<T>): Promise<ResponseType<T>> {
    let res: AxiosResponse
    try {
      res = await this.axiosInstance.request(axiosConfig)
    } catch (err: unknown) {
      const { method, url } = axiosConfig
      let statusCode = 500
      if (err instanceof AxiosError && err.response?.status) {
        statusCode = err.response.status
      }
      throw new HttpError({
        statusCode,
        message: `${method.toUpperCase()} request to '${url}' failed with status ${statusCode}`,
        errorType: 'REQUEST_FAILED',
        originalError: serializeError(err),
      })
    }

    const validation = responseSchema.safeParse(res.data)
    if (!validation.success) {
      throw new HttpError({
        statusCode: 500,
        message: `Response from ${axiosConfig.url} was not in the expected shape`,
        errorType: 'VALIDATION_ERROR',
        details: validation.error,
      })
    }
    return validation.data
  }

  /**
   * Makes `GET` request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async get<T extends z.ZodType | undefined = undefined>({
    url,
    responseSchema,
    ...config
  }: ConvenienceHttpConfig<T>): Promise<ResponseType<T>> {
    return this.request({ url, method: 'GET', responseSchema, ...config })
  }

  /**
   * Makes `POST` request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async post<T extends z.ZodType | undefined = undefined>({
    url,
    responseSchema,
    ...config
  }: ConvenienceHttpConfig<T>): Promise<ResponseType<T>> {
    return this.request({ url, method: 'POST', responseSchema, ...config })
  }

  /**
   * Makes `PUT` request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async put<T extends z.ZodType | undefined = undefined>({
    url,
    responseSchema,
    ...config
  }: ConvenienceHttpConfig<T>): Promise<ResponseType<T>> {
    return this.request({ url, method: 'PUT', responseSchema, ...config })
  }

  /**
   * Makes `DELETE` request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async delete<T extends z.ZodType | undefined = undefined>({
    url,
    responseSchema,
    ...config
  }: ConvenienceHttpConfig<T>): Promise<ResponseType<T>> {
    return this.request({ url, method: 'DELETE', responseSchema, ...config })
  }

  /**
   * Makes `PATCH` request via the configured axios instance.
   * Validates response against `zod` schema.
   * Throws a `HttpError` on axios or zod validation failure.
   */
  async patch<T extends z.ZodType | undefined = undefined>({
    url,
    responseSchema,
    ...config
  }: ConvenienceHttpConfig<T>): Promise<ResponseType<T>> {
    return this.request({ url, method: 'PATCH', responseSchema, ...config })
  }
}

// Create default instance with retry logic for backwards compatibility
/**
 * Mutates the given `axiosInstance` to retry on errors.
 *
 * ⚠️ Throws `HttpError`, not `AxiosError`
 */
function attachRetryLogic(
  axiosInstance: AxiosInstance,
  retryConfig?: IAxiosRetryConfig,
): void {
  axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (err) => {
      // You could potentially retry if 429 + POST but to be safe we'll skip it
      // Skip retry on non-idempotent requests (e.g. POST)
      if (!axiosRetry.isIdempotentRequestError(err)) {
        return false
      }

      // Retry on network errors (e.g. ECONNREFUSED)
      // or if the server failed to respond (status is undefined)
      const status = err.response?.status
      if (status === undefined || axiosRetry.isNetworkError(err)) {
        return true
      }

      // Skip retry on 4xx client errors (but retry on 429 Too Many Requests)
      const isClientError = status >= 400 && status !== 429 && status < 500
      if (isClientError) {
        return false
      }

      // Retry on server error
      const isServerError = status >= 500
      return isServerError
    },
    // onRetry: (retryCount, error, requestConfig) => {
    //   const url = requestConfig.url || 'unknown'
    //   const method = requestConfig.method?.toUpperCase() || 'unknown'
    //   const status = error.response?.status || 'network error'
    //   logger.debug(
    //     `🔄 Retrying ${method} ${url} (attempt ${retryCount}/3) - ${status}`,
    //   )
    // },
    ...retryConfig,
  })
}

export { HttpClient, HttpError }
