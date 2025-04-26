/**
 * Configuration for Dynamic.xyz authentication integration with Convex
 */

// Replace .cloud with .site for the auth domain
// export const CONVEX_HTTP_API_URL = 'https://precise-ocelot-791.convex.site';
export const CONVEX_HTTP_API_URL = process.env.SITE_URL;

export const CONVEX_APPLICATION_ID = 'convex';

export default {
  providers: [
    {
      // Our Convex deployment URL will be the token issuer
      domain: CONVEX_HTTP_API_URL,
      // A unique identifier for our application
      applicationID: CONVEX_APPLICATION_ID,
    },
  ],
};
