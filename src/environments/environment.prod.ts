// Production environment configuration
export const environment = {
  production: true,
  tmdb: {
    apiKey: 'cbf5458610b11818a11f37639d93dd34', // Replace with your actual TMDB API key
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    imageSizes: {
      poster: 'w500',
      backdrop: 'original',
      profile: 'w185',
    }
  },
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar', 'fr', 'zh'],
};
