/*
 * List of configurations can be included here
 */

const config = {
  apiKey: 'a31c05d546604f62b1bde75bb5a581df',
  baseUrl: 'https://newsapi.org/v2/everything',
  domains: [
    {
      name: 'The Next Web',
      key: 'thenextweb',
      source: 'the-next-web',
      point: 'thenextweb.com'
    },
    {
      name: 'TechCrunch',
      key: 'techcrunch',
      source: 'techcrunch',
      point: 'techcrunch.com'
    },
    {
      name: 'Mashable',
      key: 'mashable',
      source: 'mashable',
      point: 'mashable.com'
    },
    {
      name: 'CNN News',
      key: 'cnn',
      source: 'cnn',
      point: 'cnn.com'
    }
  ]
}

export default config;
