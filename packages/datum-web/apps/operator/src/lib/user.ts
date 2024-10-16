import useSWR from 'swr'

import { getPathWithQuery } from '@repo/common/routes'
import { DEFAULT_ERROR_MESSAGE, OPERATOR_API_ROUTES } from '@repo/constants'

import { RegisterUserInput } from '@/utils/schemas'

export interface LoginUser {
  username: string
  password: string
}

export interface PasskeyRegOptionsInput {
  email: string
  name: string
}

export interface PasskeySignInOptionsInput {
  email: string
}

export interface RegistrationVerificationInput {
  attestationResponse: any
}

export interface AuthVerificationInput {
  assertionResponse: any
}
interface HttpResponse<T> extends Response {
  message?: T
}

export interface SwitchWorkspace {
  target_organization_id: string
}

export async function registerUser<T>(arg: RegisterUserInput) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.register,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      },
    )
    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}

export const useVerifyUser = (arg: string | null) => {
  const { data, isLoading, error } = useSWR(
    arg
      ? `${getPathWithQuery(OPERATOR_API_ROUTES.verify, { token: arg })}`
      : null,
    async (url) => {
      return (await fetch(url)).json()
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 0,
      revalidateIfStale: false,
    },
  )
  return {
    verified: data,
    isLoading,
    error,
  }
}

export const useAcceptWorkspaceInvite = (arg: string | null) => {
  const { data, isLoading, error } = useSWR(
    arg
      ? `${getPathWithQuery(OPERATOR_API_ROUTES.invite, { token: arg })}`
      : null,
    async (url) => {
      return (
        await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      ).json()
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 0,
      revalidateIfStale: false,
    },
  )
  return {
    verified: data,
    isLoading,
    error,
  }
}

export async function getPasskeyRegOptions<T>(arg: PasskeyRegOptionsInput) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.registrationOptions,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
        credentials: 'include',
      },
    )

    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}

export async function verifyRegistration<T>(
  arg: RegistrationVerificationInput,
) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.registrationVerification,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
        credentials: 'include',
      },
    )
    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}

export async function getPasskeySignInOptions<T>(
  arg: PasskeySignInOptionsInput,
) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.signinOptions,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
        credentials: 'include',
      },
    )

    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}

export async function verifyAuthentication<T>(arg: AuthVerificationInput) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.signinVerification,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg.assertionResponse),
        credentials: 'include',
      },
    )
    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}

export async function switchWorkspace<T>(arg: SwitchWorkspace) {
  try {
    const response: HttpResponse<T> = await fetch(
      OPERATOR_API_ROUTES.switchWorkspace,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
        credentials: 'include',
      },
    )
    const responseBody = await response.json()

    if (!response.ok) {
      const errorMessage = responseBody?.message || DEFAULT_ERROR_MESSAGE
      return { message: errorMessage }
    }

    return responseBody
  } catch (error) {
    return { message: DEFAULT_ERROR_MESSAGE }
  }
}
