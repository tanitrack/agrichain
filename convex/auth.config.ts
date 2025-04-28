/**
 * Configuration for Dynamic.xyz authentication integration with Convex
 */

import { CONVEX_APPLICATION_ID, CONVEX_HTTP_API_URL } from './constants';

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
