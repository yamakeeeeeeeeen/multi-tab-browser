const isValidUrl = (url: string) => {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

export const useValidation = () => {
  return {
    url: () => ({
      url: (value: string) => isValidUrl(value) || value === '' || 'Enter in the form of a URL.',
    }),
  };
};
