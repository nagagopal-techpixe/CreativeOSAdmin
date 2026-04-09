import { useState, useEffect } from 'react'

// Module-level cache so only one fetch happens across all components
let cachedVisibility = null
let fetchPromise = null

const DEFAULT_VISIBILITY = {
  topCards: {
    enabled: true,
    blocks: {
      heroBanner: true,
      socialPost: true,
      emailHeader: true,
    },
  },
  smartPresets: {
    enabled: true,
    blocks: {
      mobileProductAd: true,
      superheroPoster: true,
      luxuryPortrait: true,
    },
  },
  imagePromptBuilder: {
    enabled: true,
    steps: {
      step1: {
        enabled: true,
        blocks: {
          ugcTestimonial: true,
          productHero: true,
          lifestyle: true,
          flatLay: true,
          beforeAfter: false,
          unboxing: true,
        },
      },
      step2: {
        enabled: true,
        blocks: {
          photorealistic: true,
          illustrated: true,
          threeDRender: true,
          sketch: false,
        },
      },
      step3: {
        enabled: true,
        blocks: {
          backgroundSetting: true,
          lightingMood: true,
          colorPalette: true,
        },
      },
      step4: {
        enabled: true,
        blocks: {
          square1x1: true,
          portrait4x5: true,
          landscape16x9: true,
          story9x16: true,
        },
      },
    },
  },
  sidebarMenu: {
    enabled: true,
    blocks: {
      images: true,
      videos: true,
      voice: true,
      music: false,
      characters: true,
    },
  },
}

async function fetchVisibility() {
  if (cachedVisibility) return cachedVisibility

  if (!fetchPromise) {
    fetchPromise = fetch('/api/visibility')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch visibility')
        return res.json()
      })
      .then((data) => {
        cachedVisibility = data
        return data
      })
      .catch(() => {
        // If API is not available, fall back to defaults
        cachedVisibility = DEFAULT_VISIBILITY
        return DEFAULT_VISIBILITY
      })
  }

  return fetchPromise
}

export function clearVisibilityCache() {
  cachedVisibility = null
  fetchPromise = null
}

export function useVisibility() {
  const [visibility, setVisibility] = useState(cachedVisibility)
  const [loading, setLoading] = useState(!cachedVisibility)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cachedVisibility) {
      setVisibility(cachedVisibility)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchVisibility()
      .then((data) => {
        setVisibility(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  /**
   * isVisible(section, blockKey, nestedSection?)
   * Returns true by default if the block is not found in the API response.
   *
   * Examples:
   *   isVisible('topCards', 'heroBanner')
   *   isVisible('imagePromptBuilder', 'lifestyle', 'step1')
   *   isVisible('sidebarMenu', 'music')
   */
  function isVisible(section, blockKey, nestedSection = null) {
    if (!visibility) return true

    const sectionData = visibility[section]
    if (!sectionData) return true
    if (sectionData.enabled === false) return false

    if (nestedSection) {
      const stepData = sectionData.steps?.[nestedSection]
      if (!stepData) return true
      if (stepData.enabled === false) return false
      const val = stepData.blocks?.[blockKey]
      return val === undefined ? true : val
    }

    const val = sectionData.blocks?.[blockKey]
    return val === undefined ? true : val
  }

  return { visibility, loading, error, isVisible }
}

export { DEFAULT_VISIBILITY }