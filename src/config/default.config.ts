export const config = {
  authentication: {
    auth0Jwt: {
      payload: {
        audience: 'https://currency-converter-api',
        issuer: 'AUTH0_JWT_ISSUER',
        requestProperty: 'user',
      },
      options: {
        expiresIn: '1h',
      },
    },
    ext_auth0Jwt: {
      payload: {
        audience: 'EXT_AUTH0_JWT_AUDIENCE',
        issuer: 'EXT_AUTH0_JWT_ISSUER',
        requestProperty: 'external machine',
      },
      options: {
        expiresIn: '1h',
      },
    },
  },
};
