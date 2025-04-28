import { v } from 'convex/values';
import { httpAction, internalAction } from './_generated/server';
import * as jose from 'jose';
import { internal } from './_generated/api';
import { corsHeaders } from './corsHeaders';
import {
  CONVEX_HTTP_API_URL,
  CONVEX_APPLICATION_ID,
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
  JWKS_ENDPOINT,
  JWKS_CONVEX_ENDPOINT,
} from './constants';

// Cache JWKS to prevent rate limiting
let cachedJWKS: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

function getDynamicJWKS() {
  if (!cachedJWKS) {
    cachedJWKS = jose.createRemoteJWKSet(
      new URL(
        'https://app.dynamic.xyz/api/v0/sdk/8becfdc4-eadf-4f17-9d46-4dfff0abf098/.well-known/jwks'
      )
    );
  }
  return cachedJWKS;
}

async function getConvexJWKS() {
  const url = JWKS_CONVEX_ENDPOINT;
  const convexRemoteURL = new URL(url);

  const JWKS = jose.createRemoteJWKSet(convexRemoteURL);

  return JWKS;
}

async function verifyDynamicToken(token: string) {
  const DynamicJWKS = getDynamicJWKS();

  const payload = await jose.jwtVerify(token, DynamicJWKS, {
    issuer: 'app.dynamicauth.com/8becfdc4-eadf-4f17-9d46-4dfff0abf098',
    audience: 'http://localhost:8080',
  });

  return payload;
}

/**
 * A debug function for verifying a JWT token issued by Convex using JWKS (JSON Web Key Set)
 * @param token - The JWT token string to verify
 * @returns The decoded token payload if verification succeeds, null if verification fails
 */

// eslint-disable-next-line unused-imports/no-unused-vars
async function verifyConvexToken(token: string) {
  try {
    const convexJWKS = await getConvexJWKS();

    const { payload } = await jose.jwtVerify(token, convexJWKS, {
      issuer: CONVEX_HTTP_API_URL,
      audience: CONVEX_APPLICATION_ID,
    });

    return payload;
  } catch (error) {
    console.error('Verification error details:');
    console.error(' error: ', String(error));
    console.error('errorName:', error instanceof Error ? error.message : 'Unknown error');
    console.error('errorMessage:', error instanceof Error ? error.message : 'Unknown error');

    return null;
  }
}

interface DynamicTokenPayload extends jose.JWTPayload {
  kid: string;
  aud: string;
  iss: string;
  sub: string;
  sid: string;
  email?: string;
  environment_id: string;
  verified_credentials: Array<{
    address?: string;
    chain?: string;
    id: string;
    public_identifier: string;
    wallet_name?: string;
    wallet_provider?: string;
    format: 'blockchain' | 'email';
    lastSelectedAt?: string;
    signInEnabled: boolean;
    email?: string;
  }>;
  last_verified_credential_id: string;
  first_visit: string;
  last_visit: string;
  new_user: boolean;
  metadata: Record<string, unknown>;
}

// Define the expected shape of our Convex token payload
interface ConvexTokenPayload extends jose.JWTPayload {
  sub: string;
  sid: string;
  wallet_address?: string;
  chain?: string;
  wallet_provider?: string;
  email?: string;
  environment_id: string;
  first_visit: string;
  last_visit: string;
  new_user: boolean;
  iss: string;
  aud: string;
}

// Convex internal action for token verification
export const verifyConvexTokenAction = internalAction({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      const convexJWKS = await getConvexJWKS();

      const { payload } = await jose.jwtVerify(token, convexJWKS, {
        issuer: CONVEX_HTTP_API_URL,
        audience: CONVEX_APPLICATION_ID,
      });

      // Type assertion with runtime validation
      const convexPayload = payload as ConvexTokenPayload;

      // Validate required fields
      if (!convexPayload.sub || !convexPayload.sid || !convexPayload.environment_id) {
        return {
          valid: false,
          error: 'Invalid token payload: missing required fields',
        };
      }

      // Return successful validation with payload
      return {
        valid: true,
        payload: convexPayload,
      };
    } catch (error) {
      console.error('Verification error details:', {
        error: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof jose.errors.JWTExpired) {
        return {
          valid: false,
          error: 'Token has expired',
        };
      }
      if (error instanceof jose.errors.JWTClaimValidationFailed) {
        return {
          valid: false,
          error: `Token validation failed: ${error.message}`,
        };
      }
      if (error instanceof SyntaxError) {
        return {
          valid: false,
          error: 'Invalid token format',
        };
      }
      return {
        valid: false,
        error: 'Token verification failed',
      };
    }
  },
});

async function signConvexToken(payload: DynamicTokenPayload) {
  if (!JWT_PRIVATE_KEY) {
    throw new Error('JWT_PRIVATE_KEY environment variable not set');
  }

  const privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY, 'RS256');

  if (!JWT_PUBLIC_KEY) {
    throw new Error('JWT_PUBLIC_KEY environment variable not set');
  }

  // Get kid from the public JWK
  const jwks = JSON.parse(JWT_PUBLIC_KEY ?? '{"keys":[]}');
  const kid = jwks.keys?.[0]?.kid || 'key-1'; // Use the kid from the existing key

  // Create claims exactly matching Convex's test code
  const now = Math.floor(Date.now() / 1000);
  const token = await new jose.SignJWT({
    ...payload,
    iat: now,
    exp: now + 7200, // 2 hours
  })
    .setProtectedHeader({
      alg: 'RS256',
      kid, // Use the same kid as in the JWKS
      typ: 'JWT',
      kty: 'RSA',
    })
    .setIssuer(CONVEX_HTTP_API_URL ?? 'FAILED FAILED FAILED')
    .setAudience(CONVEX_APPLICATION_ID)
    .sign(privateKey);

  return token;
}

export const convertDynamicToken = internalAction({
  args: { dynamicToken: v.string() },
  handler: async (ctx, { dynamicToken }) => {
    try {
      // Verify the Dynamic token
      const { payload } = await verifyDynamicToken(dynamicToken);
      const dynamicPayload = payload as DynamicTokenPayload;

      // Validate environment ID
      if (dynamicPayload.environment_id !== '8becfdc4-eadf-4f17-9d46-4dfff0abf098') {
        throw new Error('Invalid environment ID');
      }

      // Create Convex token with necessary claims
      const convexToken = await signConvexToken(dynamicPayload);

      // Get the primary credential for session creation
      const primaryCredential = dynamicPayload.verified_credentials.find(
        (vc) => vc.id === dynamicPayload.last_verified_credential_id
      );

      // Create a session for the user
      await ctx.runMutation(internal.sessions.createSession, {
        userId: dynamicPayload.sub,
        sessionToken: convexToken,
        provider: 'dynamic',
        wallet: primaryCredential?.address,
        chainId: primaryCredential?.chain,
        email: dynamicPayload.email,
        // Use public_identifier as name if no email credential exists
        name: primaryCredential?.public_identifier,
      });

      return { token: convexToken };
    } catch (error) {
      console.error('Token conversion error:', error);
      throw new Error('Token verification failed');
    }
  },
});

export const openIdConfigurationHttpHandler = httpAction(async (ctx, request) => {
  console.log('openid-configuration called by request');
  console.log('origin:', request.headers.get('origin'));
  console.log('endpoint:', request.url);
  console.log({ request });

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return new Response(
    JSON.stringify({
      issuer: CONVEX_HTTP_API_URL,
      jwks_uri: `${CONVEX_HTTP_API_URL}${JWKS_ENDPOINT}`,
      authorization_endpoint: `${CONVEX_HTTP_API_URL}/oauth/authorize`,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
});

export const jwksHttpHandler = httpAction(async (ctx, request) => {
  console.log('/jwks called by request');
  console.log('origin:', request.headers.get('origin'));
  console.log(`endpoint: ${request.url}`);
  console.log({ request });

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  if (!JWT_PUBLIC_KEY) {
    return new Response(JSON.stringify({ error: 'JWKS not configured' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  const parsedJWKS = JSON.parse(JWT_PUBLIC_KEY);

  // Use the existing JWKS directly since it's already in the correct format
  return new Response(JSON.stringify(parsedJWKS), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
});
