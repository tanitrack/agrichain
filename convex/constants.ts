export const JWT_PRIVATE_KEY = process.env.CONVEX_PRIVATE_JWK;
export const JWT_PUBLIC_KEY = process.env.CONVEX_PUBLIC_JWK;
export const CONVEX_HTTP_API_URL = process.env.SITE_URL;
export const DYNAMIC_ENVIRONMENT_ID = process.env.DYNAMIC_ENVIRONMENT_ID;

export const CONVEX_APPLICATION_ID = 'convex';

export const JWKS_ENDPOINT = '/.well-known/jwks.json';
export const JWKS_CONVEX_ENDPOINT = `${CONVEX_HTTP_API_URL}${JWKS_ENDPOINT}?v=3`;
