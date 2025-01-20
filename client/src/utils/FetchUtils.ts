import globalProperties from '@/resources/GlobalProperties'
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import SessionStoreManager from './SessionStorageUtils'

export interface BaseResponseHandler {
  onResolved: (reponse: AxiosResponse) => void
  onReject?: (response: AxiosResponse) => void
}

const request = async (config: InternalAxiosRequestConfig) => {
  const token = SessionStoreManager.local.get(globalProperties.ACCESS_TOKEN)
  if (token) {
    config.headers.setAuthorization(`Bearer ${token}`)
  }
  return config
}

const instance = axios.create({
  baseURL: '/api/v1/',
  withCredentials: true
})

instance.interceptors.request.use(request)

const onSuccess = <T>(response: AxiosResponse<T>) => response.data
const onError = (error: AxiosError<unknown, any>) => {
  const { response } = error as AxiosError
  if (response) {
    return Promise.reject(response)
  }
  return Promise.reject(error)
}

export const Fetch = {
  get: (url: string, config?: AxiosRequestConfig) =>
    instance.get(url, config).then(onSuccess).catch(onError),
  post: (url: string, body?: any, config?: AxiosRequestConfig) =>
    instance
      .post(url, body, { ...config })
      .then(onSuccess)
      .catch(onError)
}
