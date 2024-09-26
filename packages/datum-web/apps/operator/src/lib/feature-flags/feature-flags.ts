'use server'

import { OpenFeature } from '@openfeature/server-sdk'
import { GoFeatureFlagProvider } from '@openfeature/go-feature-flag-provider'
import { auth } from '@/lib/auth/auth'

const goFeatureFlagProvider: GoFeatureFlagProvider = new GoFeatureFlagProvider({
  endpoint: process.env.FEATURE_FLAG_PROVIDER_URL!,
})

OpenFeature.setProvider(goFeatureFlagProvider)

const featureFlagClient = OpenFeature.getClient('operator')

export async function getFeatureFlag(flagKey: string, defaultValue: any) {
  const session = await auth()
  const context = {
    targetingKey: session?.user.userId,
    email: session?.user.email,
  }
  return featureFlagClient.getBooleanValue(flagKey, defaultValue, context)
}
