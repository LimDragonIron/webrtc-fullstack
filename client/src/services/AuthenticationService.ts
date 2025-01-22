import { BaseResponseHandler, Fetch } from '@/utils/FetchUtils'
import globalProperties  from '@/resources/GlobalProperties'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ServiceActions, } from './KeysAndActions'
import { AxiosResponse } from 'axios'
import { LoginPayLoad, LoginReseponse } from '@/schema/signinSchema'

export const useAuthentication = (baseResponse: BaseResponseHandler) => {
  return useMutation({
    mutationKey: [ServiceActions.LOGIN.SIGN_IN],
    mutationFn: async (payload: LoginPayLoad) => {
      const { email, password } = payload
      return await Fetch.post(process.env.login_endpoint!, {
        email,
        password
      })
    },
    onSuccess: (response: AxiosResponse<LoginReseponse>) => {
      try{
        console.log(response)
        LoginReseponse.parse(response)
        baseResponse.onResolved(response)
      }catch(error){
        console.log(error)
        throw error
      }
    },
    onError: baseResponse.onReject
  })
}
