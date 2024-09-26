'use client'

import React from 'react'
import { OpenFeature, OpenFeatureProvider, useFlag } from '@openfeature/react-sdk'
import { EvaluationContext } from '@openfeature/core'
import { GoFeatureFlagWebProvider } from '@openfeature/go-feature-flag-web-provider'

const goFeatureFlagWebProvider = new GoFeatureFlagWebProvider({
  endpoint: process.env.NEXT_PUBLIC_FEATURE_FLAG_PROVIDER_URL!,
})
OpenFeature.setProvider(goFeatureFlagWebProvider)

export function FeatureFlagsProvider({
  children,
  context,
}: {
  children: React.ReactNode
  context: EvaluationContext
}) {
  OpenFeature.setContext(context)
  return <OpenFeatureProvider>{children}</OpenFeatureProvider>
}

//
// This is a wrapper that allows us to use feature flags in a React context.
// It is **only used in the client**.
//
// Example usage:
//
// import { useFeatureFlag } from '@/providers/feature-flags-provider'
// ...
// const localTest = useFeatureFlag('local-test', false)
//
export function useFeatureFlag(flagKey: string, defaultValue: any) {
  return useFlag(flagKey, defaultValue)
}
