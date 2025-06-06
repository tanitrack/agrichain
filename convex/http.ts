import { httpRouter } from 'convex/server';
import {
  convertTokenHttpHandler,
  jwksHttpHandler,
  openIdConfigurationHttpHandler,
  verifyConvexTokenHttpHandler,
} from './auth';
import { JWKS_ENDPOINT } from './constants';
import { taniIdLoginHttpHandler } from './users';

const http = httpRouter();

// OpenID Configuration endpoint
http.route({
  path: '/.well-known/openid-configuration',
  method: 'OPTIONS',
  handler: openIdConfigurationHttpHandler,
});

http.route({
  path: '/.well-known/openid-configuration',
  method: 'GET',
  handler: openIdConfigurationHttpHandler,
});

http.route({
  path: JWKS_ENDPOINT,
  method: 'OPTIONS',
  handler: jwksHttpHandler,
});

// JWKS endpoint
http.route({
  path: JWKS_ENDPOINT,
  method: 'GET',
  handler: jwksHttpHandler,
});

// Token verification preflight handler
http.route({
  path: '/auth/convert-token',
  method: 'OPTIONS',
  handler: convertTokenHttpHandler,
});

// Token verification endpoint
http.route({
  path: '/auth/convert-token',
  method: 'POST',
  handler: convertTokenHttpHandler,
});

// Token verification preflight handler
http.route({
  path: '/auth/verify-token',
  method: 'OPTIONS',
  handler: verifyConvexTokenHttpHandler,
});

// Token verification endpoint
http.route({
  path: '/auth/verify-token',
  method: 'POST',
  handler: verifyConvexTokenHttpHandler,
});

// Tani ID login preflight handler
http.route({
  path: '/auth/tani-id-login',
  method: 'OPTIONS',
  handler: taniIdLoginHttpHandler,
});

// Tani ID login endpoint
http.route({
  path: '/auth/tani-id-login',
  method: 'POST',
  handler: taniIdLoginHttpHandler,
});

export default http;
