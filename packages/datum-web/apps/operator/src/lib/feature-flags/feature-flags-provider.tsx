'use client'

import React from 'react'
import { OpenFeature, OpenFeatureProvider } from '@openfeature/react-sdk'
import { EvaluationContext } from '@openfeature/core'
import { GoFeatureFlagWebProvider } from '@openfeature/go-feature-flag-web-provider'

const goFeatureFlagWebProvider = new GoFeatureFlagWebProvider({
  endpoint: process.env.NEXT_PUBLIC_FEATURE_FLAG_PROVIDER_URL!,
})
OpenFeature.setProvider(goFeatureFlagWebProvider)

//
// This is a wrapper that allows us to use feature flags in a React context.
// It is **only used in the client**.
//
// Example usage:
//
// import { useFlag } from '@openfeature/react-sdk'
// ...
// const localTest = useFlag('local-test', false)
//
// https://openfeature.dev/docs/reference/technologies/client/web/react#evaluation-hooks
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
