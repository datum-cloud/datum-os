'use server'

import { OpenFeature } from '@openfeature/server-sdk'
import { GoFeatureFlagProvider } from '@openfeature/go-feature-flag-provider'
import { auth } from '@/lib/auth/auth'

const goFeatureFlagProvider: GoFeatureFlagProvider = new GoFeatureFlagProvider({
  endpoint: process.env.NEXT_PUBLIC_FEATURE_FLAG_PROVIDER_URL!,
  apiKey: process.env.NEXT_PUBLIC_FEATURE_FLAG_PROVIDER_API_KEY!,
})

OpenFeature.setProvider(goFeatureFlagProvider)

const featureFlagClient = OpenFeature.getClient('operator')

const context = async () => {
  const session = await auth()
  return {
    targetingKey: session?.user.userId,
    email: session?.user.email,
  }
}

//
// This is a wrapper that allows us to use feature flags in Next.js server components.
// It is **only used in the client**.
//
// Example usage:
//
// import { getFeatureFlag } from '@/providers/feature-flags'
// ...
// const localTest = getFeatureFlagBool('local-test', false)
//
export async function getFeatureFlagBool(flagKey: string, defaultValue: any) {
  return featureFlagClient.getBooleanValue(
    flagKey,
    defaultValue,
    await context(),
  )
}

export async function getFeatureFlagString(flagKey: string, defaultValue: any) {
  return featureFlagClient.getStringValue(
    flagKey,
    defaultValue,
    await context(),
  )
}

export async function getFeatureFlagNumber(flagKey: string, defaultValue: any) {
  return featureFlagClient.getNumberValue(
    flagKey,
    defaultValue,
    await context(),
  )
}

export async function getFeatureFlagObject(flagKey: string, defaultValue: any) {
  return featureFlagClient.getObjectValue(
    flagKey,
    defaultValue,
    await context(),
  )
}
