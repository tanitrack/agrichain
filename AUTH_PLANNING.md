# Dynamic.xyz to Convex Token Conversion Implementation Plan

## Table of Contents

1. [Overview](#overview)
2. [Core Implementation](#core-implementation)
3. [Technical Details](#technical-details)
4. [Infrastructure Setup](#infrastructure-setup)
5. [Session Management](#session-management)
6. [Security & Best Practices](#security--best-practices)
7. [Future Enhancements](#future-enhancements)
8. [Testing & Maintenance](#testing--maintenance)
9. [References](#references)

## Overview

### Token Flow

1. Frontend obtains token from Dynamic.xyz
2. Frontend sends token to Convex internal action
3. Convex verifies token using Dynamic's JWKS
4. Convex generates new token compatible with its system
5. Frontend uses converted token for Convex operations

### System Components

- Frontend: React application with Dynamic.xyz and Convex integration
- Dynamic.xyz: External authentication provider
- Convex Backend:
  - Token conversion action
  - Session management
  - Protected queries/mutations

### Architecture Overview

The implementation follows Convex's custom auth integration pattern with three main aspects:

#### Authentication Flow

```text
Client → Dynamic Auth → Dynamic Token →
Token Conversion → Convex Token → Session Creation
```

#### Component Responsibilities

- Dynamic.xyz: User authentication and wallet verification
- Convex: Token conversion, session management, and access control
- Frontend: Integration and token management

#### Security Boundaries

- Dynamic token only used during conversion
- Convex token for all internal operations
- Session management for persistent authentication

## Core Implementation

### Configuration Setup

```typescript
// convex/auth.config.ts
export const CONVEX_HTTP_API_URL = 'https://your-deployment.convex.cloud'.replace(
  '.cloud',
  '.site'
);

export default {
  providers: [
    {
      domain: CONVEX_HTTP_API_URL,
      applicationID: 'convex-dynamic',
    },
  ],
};
```

### Token Conversion Action

```typescript
// convex/authNode.ts
import { internalAction } from './_generated/server';
import { v } from 'convex/values';
import * as jose from 'jose';

export const convertDynamicToken = internalAction({
  args: { dynamicToken: v.string() },
  handler: async (ctx, { dynamicToken }) => {
    try {
      const { payload } = await verifyDynamicToken(dynamicToken);
      const convexToken = await signToken({
        sub: payload.sub,
        wallet: payload.wallet_address,
        chainId: payload.chain_id,
      });
      return { token: convexToken };
    } catch (error) {
      throw new Error('Token verification failed');
    }
  },
});
```

### Client Integration

```typescript
// src/auth/DynamicAuth.ts
import { ConvexProviderWithAuth } from 'convex/react';
import { useDynamicAuth } from '@dynamic-labs/sdk-react';
import { api } from '../convex/_generated/api';

function useAuthFromDynamic() {
  const { isLoading, isAuthenticated, getToken } = useDynamicAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }) => {
      try {
        const dynamicToken = await getToken({
          ignoreCache: forceRefreshToken,
        });

        if (!dynamicToken) return null;

        const { token } = await convex.mutation(api.authNode.convertDynamicToken, {
          dynamicToken,
        });

        return token;
      } catch (error) {
        console.error('Token conversion failed:', error);
        return null;
      }
    },
    [getToken]
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: isAuthenticated ?? false,
      fetchAccessToken,
    }),
    [isLoading, isAuthenticated, fetchAccessToken]
  );
}
```

### Provider Setup

```typescript
// src/App.tsx
import { ConvexProviderWithAuth } from 'convex/react';
import { DynamicAuthProvider } from '@dynamic-labs/sdk-react';

function App() {
  return (
    <DynamicAuthProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromDynamic}>
        {/* Your app content */}
      </ConvexProviderWithAuth>
    </DynamicAuthProvider>
  );
}
```

### Basic Usage Example

```typescript
// Example protected query
import { query } from './_generated/server';
import { v } from 'convex/values';

export const protectedQuery = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Access user information
    const { subject, tokenIdentifier } = identity;
    const wallet = identity.wallet;

    // Your query logic here
  },
});
```

## Technical Details

### Token Verification Process

```typescript
async function verifyDynamicToken(token: string) {
  const JWKS = jose.createRemoteJWKSet(
    new URL(
      'https://app.dynamic.xyz/api/v0/sdk/8becfdc4-eadf-4f17-9d46-4dfff0abf098/.well-known/jwks'
    )
  );

  return await jose.jwtVerify(token, JWKS, {
    issuer: 'https://app.dynamic.xyz/api/v0/sdk/8becfdc4-eadf-4f17-9d46-4dfff0abf098',
    clockTolerance: 15, // 15 seconds of clock skew allowed
    maxTokenAge: '1h', // Important: Limit token age
  });
}

// Add JWKS caching to prevent rate limiting
let cachedJWKS: ReturnType<typeof jose.createRemoteJWKSet> | null = null;
function getJWKS() {
  if (!cachedJWKS) {
    cachedJWKS = jose.createRemoteJWKSet(
      new URL(
        'https://app.dynamic.xyz/api/v0/sdk/8becfdc4-eadf-4f17-9d46-4dfff0abf098/.well-known/jwks'
      )
    );
  }
  return cachedJWKS;
}
```

### Token Generation

```typescript
async function signToken(payload: any) {
  const privateKey = await jose.importPKCS8(process.env.CONVEX_PRIVATE_JWK!, 'RS256');

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256', kid: 'key-1' })
    .setIssuedAt()
    .setIssuer(CONVEX_HTTP_API_URL)
    .setAudience('convex-dynamic')
    .setExpirationTime('2h')
    .sign(privateKey);
}
```

### Claim Transformation

```typescript
interface ConvexClaims {
  iss: string; // Our Convex site URL
  sub: string; // User identifier
  aud: string; // 'convex-dynamic'
  exp: number; // Expiration time
  iat: number; // Issued at time
  auth_time?: number; // Original authentication time
  wallet: string; // from Dynamic's wallet_address
  chainId: number; // from Dynamic's chain_id
}
```

## Infrastructure Setup

### Key Generation

Create `scripts/generateKeys.mjs`:

```typescript
import * as jose from 'jose';

async function generateKeys() {
  const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
  const privateKeyPKCS8 = await jose.exportPKCS8(privateKey);
  const publicJWK = await jose.exportJWK(publicKey);

  const jwk = {
    ...publicJWK,
    use: 'sig',
    kid: 'key-1',
    alg: 'RS256',
  };

  console.log('CONVEX_PRIVATE_JWK=' + JSON.stringify(privateKeyPKCS8));
  console.log('CONVEX_PUBLIC_JWK=' + JSON.stringify({ keys: [jwk] }));
}

generateKeys();
```

### Environment Variables

Required variables:

```text
CONVEX_PRIVATE_JWK="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### JWKS Configuration

Public JWKS structure:

```json
{
  "keys": [
    {
      "kty": "RSA",
      "n": "...",
      "e": "AQAB",
      "use": "sig",
      "kid": "key-1",
      "alg": "RS256"
    }
  ]
}
```

### Deployment Steps

1. Install dependencies:

   ```bash
   pnpm add jose @dynamic-labs/sdk-react
   ```

1. Generate key pair:

   ```bash
   node scripts/generateKeys.mjs
   ```

1. Set environment variables in Convex dashboard
1. Configure Dynamic.xyz application settings

## Session Management

### Session Schema

```typescript
interface Session {
  _id: Id<'sessions'>;
  userId: string;
  sessionToken: string;
  provider: string;
  lastVerified: number;
  expiresAt: number;
  createdAt: number;
}
```

### Storage Strategy

1. Store only session metadata, never raw tokens
2. Use session token as reference
3. Implement automatic cleanup for expired sessions

### Session Operations

1. Create/Update session
2. Validate session state
3. Handle session expiration
4. Clean up expired sessions

## Security & Best Practices

### Key Protection

1. Secure storage of private key
2. Regular key rotation
3. Proper error handling for key operations

### Token Validation

1. Verify all standard claims
2. Implement proper error handling
3. Add rate limiting for token operations

### Monitoring

1. Track token conversion attempts
2. Monitor session states
3. Log security-relevant events

## Future Enhancements

### Advanced Features

1. Token refresh mechanism
2. Multi-device support
3. Custom claims mapping
4. Role-based access control

### Performance Optimization

1. JWKS caching
2. Session caching
3. Request queuing

### Key Rotation Strategy

1. Regular key rotation schedule
2. Grace period for old keys
3. Automatic key generation

## Testing & Maintenance

### Testing Strategy

1. Unit tests for token operations
2. Integration tests for auth flow
3. Security testing
4. Performance testing

### Common Issues

1. Token verification failures
2. Session expiration issues
3. Network timeouts
4. Key rotation problems

### Regular Tasks

1. Monitor error rates
2. Clean up expired sessions
3. Rotate keys
4. Update dependencies

## References

### Documentation Links

- [Dynamic.xyz JWKS Endpoint](https://app.dynamic.xyz/api/v0/sdk/8becfdc4-eadf-4f17-9d46-4dfff0abf098/.well-known/jwks)
- [Convex Auth Documentation](https://docs.convex.dev/auth)
- [OpenID Connect Specifications](https://openid.net/specs/openid-connect-core-1_0.html)
- [JWT Best Practices - RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725)
- [jose Library Documentation](https://github.com/panva/jose)
- [Dynamic.xyz Authentication Documentation](https://docs.dynamic.xyz/authentication)
- [Convex Custom Auth Example](https://github.com/get-convex/convex/tree/main/npm-packages/convex/src/server/auth.ts)

### Implementation Checklist

#### Token Security

- [ ] Verify token signature
- [ ] Validate token expiration
- [ ] Check issuer and audience
- [ ] Implement token age limits
- [ ] Add rate limiting

#### Session Management

- [ ] Test session creation
- [ ] Verify session cleanup
- [ ] Test multi-device scenarios
- [ ] Monitor session states

#### Error Handling

- [ ] Token validation errors
- [ ] Network timeouts
- [ ] Rate limiting responses
- [ ] Session conflicts

#### Performance

- [ ] JWKS caching
- [ ] Session caching
- [ ] Monitor response times
- [ ] Track error rates

### Known Limitations

#### Dynamic Token Constraints

- Maximum token age: 1 hour
- Rate limits: TBD (need to verify with Dynamic)
- Required claims: sub, wallet_address, chain_id

#### Convex Constraints

- Session duration limits
- Maximum token size
- Rate limiting on auth endpoints
