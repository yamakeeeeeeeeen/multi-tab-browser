const isValidUrl = (url: string) => {
  try {
    new URL(url)
  } catch (e) {
    return false
  }
  return true
}

type Url = () => { url: (value: string) => boolean | string }
export type UseValidation = () => { url: Url }
export type UseValidationMethods = {
  url: Url
}

export const useValidation: UseValidation = () => {
  return {
    url: () => ({
      url: (value: string) => isValidUrl(value) || value === '' || 'Enter in the form of a URL.',
    }),
  }
}
