'use client'

import React from 'react'
import { OpenFeature, OpenFeatureProvider } from '@openfeature/react-sdk'
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
