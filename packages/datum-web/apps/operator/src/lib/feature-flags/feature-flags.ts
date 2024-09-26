'use server'

import { OpenFeature } from '@openfeature/server-sdk'
import { GoFeatureFlagProvider } from '@openfeature/go-feature-flag-provider'
import { auth } from '@/lib/auth/auth'

const goFeatureFlagProvider: GoFeatureFlagProvider = new GoFeatureFlagProvider({
  endpoint: process.env.FEATURE_FLAG_PROVIDER_URL!,
})

OpenFeature.setProvider(goFeatureFlagProvider)

const featureFlagClient = OpenFeature.getClient('operator')

//
// This is a wrapper that allows us to use feature flags in Next.js server components.
// It is **only used in the client**.
//
// Example usage:
//
// import { getFeatureFlag } from '@/lib/feature-flags/feature-flags'
// ...
// const localTest = getFeatureFlag('local-test', false)
//
export async function getFeatureFlag(flagKey: string, defaultValue: any) {
  const session = await auth()
  // TODO: Add more context here as needed.
  const context = {
    targetingKey: session?.user.userId,
    email: session?.user.email,
  }
  return featureFlagClient.getBooleanValue(flagKey, defaultValue, context)
}
