'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signinSchema } from '@/schema/signinSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { AxiosResponse } from 'axios'
import { useAuthentication } from '@/services'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { useAccountStore } from '@/stores'

interface SignInAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignInAuthForm = ({ className, ...props }: SignInAuthFormProps) => {
  const [isEmailError, setIsEmailError] = React.useState<boolean>(false)
  const [isPasswordError, setIsPasswordError] = React.useState<boolean>(false)
  const router = useRouter()
  const store = useAccountStore()

  const onSuccess = (response:any): void => {
    console.log(response)
    store.setAccountInfo(response.data)
    setIsEmailError(false)
    setIsPasswordError(false)
    // router.push('/main')
  }

  const onError = (error: AxiosResponse): void => {
    console.log('error')
    const errorStatusCode = error.data.code
    if (errorStatusCode === "account_not_found") {
      setIsEmailError(true)
    } else {
      setIsEmailError(false)
    }

    if (errorStatusCode === "account_passwrod_not_match") {
      setIsPasswordError(true)
    }
  }

  const { mutate: authentication, isPending } = useAuthentication({
    onResolved: onSuccess,
    onReject: onError
  })

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    authentication(values)
  }

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '' as string,
      password: '' as string
    }
  })

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <div className='grid gap-1'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='mb-5 flex flex-col'>
                    <FormLabel className='text-sm'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'hello@Test.com'}
                        {...field}
                        type='email'
                        className='font-roboto h-12 rounded-lg shadow-none'
                        autoCapitalize='none'
                        autoCorrect='off'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {isEmailError && 'User email is not registered.'}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='mb-5 flex flex-col'>
                    <FormLabel className='text-sm'>Password</FormLabel>
                    <FormControl>
                      <Input
                        className='font-roboto h-12 rounded-lg shadow-none'
                        placeholder={'Please enter your password.'}
                        {...field}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage>
                      {isPasswordError && 'The password is incorrect.'}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isPending}>
              {isPending && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SignInAuthForm
