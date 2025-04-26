import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { jwksHttpHandler, openIdConfigurationHttpHandler } from './auth';

const http = httpRouter();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  Vary: 'Origin',
  'Content-Type': 'application/json',
};

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
  path: '/.well-known/jwks.json',
  method: 'OPTIONS',
  handler: jwksHttpHandler,
});

// JWKS endpoint
http.route({
  path: '/.well-known/jwks.json',
  method: 'GET',
  handler: jwksHttpHandler,
});

// Token conversion preflight handler
http.route({
  path: '/auth/convert-token',
  method: 'OPTIONS',
  handler: httpAction(async (ctx, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get('Origin') !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    return new Response(null, { headers: corsHeaders });
  }),
});

// Token conversion endpoint
http.route({
  path: '/auth/convert-token',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const dynamicToken = request.headers.get('Authorization')?.split(' ')[1];
      if (!dynamicToken) {
        return new Response(JSON.stringify({ error: 'No token provided' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const result = await ctx.runAction(internal.auth.convertDynamicToken, {
        dynamicToken,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('Token conversion error:', error);
      return new Response(JSON.stringify({ error: 'Token conversion failed' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }),
});

// Token verification preflight handler
http.route({
  path: '/auth/verify-token',
  method: 'OPTIONS',
  handler: httpAction(async (ctx, request) => {
    const headers = request.headers;
    if (
      headers.get('Origin') !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    return new Response(null, { headers: corsHeaders });
  }),
});

// Token verification endpoint
http.route({
  path: '/auth/verify-token',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      // Extract token from Authorization header
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({
            error: 'No token provided',
            details: 'Authorization header must be in the format: Bearer <token>',
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      // Use the internal action to verify the token
      const result = await ctx.runAction(internal.auth.verifyConvexTokenAction, {
        token,
      });

      if (!result.valid) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: result.error,
          }),
          {
            status: result.error?.includes('expired') ? 401 : 400,
            headers: corsHeaders,
          }
        );
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('Token verification error:', error);
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Internal server error during token verification',
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  }),
});

export default http;
