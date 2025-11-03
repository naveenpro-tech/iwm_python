/**
 * Feature Flags Hook
 * 
 * Provides access to feature flags for controlling which features are visible/enabled.
 * Caches flags in localStorage for performance and offline support.
 */

import { useState, useEffect } from 'react';

export interface FeatureFlags {
  [key: string]: boolean;
}

interface UseFeatureFlagsReturn {
  flags: FeatureFlags;
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: (featureKey: string) => boolean;
  refetch: () => Promise<void>;
}

const CACHE_KEY = 'iwm_feature_flags';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedFlags {
  flags: FeatureFlags;
  timestamp: number;
}

/**
 * Hook to access feature flags
 * 
 * @returns {UseFeatureFlagsReturn} Feature flags state and utilities
 * 
 * @example
 * const { flags, isFeatureEnabled } = useFeatureFlags();
 * 
 * if (isFeatureEnabled('pulse')) {
 *   return <PulseFeature />;
 * }
 */
export function useFeatureFlags(): UseFeatureFlagsReturn {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlags = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feature-flags`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch feature flags: ${response.statusText}`);
      }

      const data = await response.json();
      const fetchedFlags = data.flags || {};

      // Cache the flags
      const cached: CachedFlags = {
        flags: fetchedFlags,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));

      setFlags(fetchedFlags);
    } catch (err) {
      console.error('Error fetching feature flags:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      // Try to use cached flags on error
      const cached = getCachedFlags();
      if (cached) {
        setFlags(cached.flags);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCachedFlags = (): CachedFlags | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedFlags = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;

      // Return cached flags if they're fresh enough
      if (age < CACHE_DURATION) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Try to load from cache first
    const cached = getCachedFlags();
    if (cached) {
      setFlags(cached.flags);
      setIsLoading(false);
    }

    // Fetch fresh flags
    fetchFlags();
  }, []);

  const isFeatureEnabled = (featureKey: string): boolean => {
    return flags[featureKey] === true;
  };

  return {
    flags,
    isLoading,
    error,
    isFeatureEnabled,
    refetch: fetchFlags,
  };
}

/**
 * Helper function to check if a feature is enabled (non-hook version)
 * Useful for use outside of React components
 * 
 * @param featureKey - The feature key to check
 * @returns boolean - Whether the feature is enabled
 */
export function isFeatureEnabled(featureKey: string): boolean {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const parsed: CachedFlags = JSON.parse(cached);
    return parsed.flags[featureKey] === true;
  } catch {
    return false;
  }
}

