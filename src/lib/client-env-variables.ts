import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

/**
 * Validates environment variables at runtime and provides type safety.
 * @see https://env.t3.gg/docs/introduction
 */
export const clientEnv = createEnv({
  /*
   * Client-side environment variables.
   * These will be exposed to the client-side code.
   * Must be prefixed with VITE_ to be exposed.
   */
  clientPrefix: 'VITE_',
  client: {
    VITE_CONVEX_URL: z.string().url(),
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_DYNAMIC_ENVIRONMENT_ID: z.string(),
    VITE_SITE_URL: z.string().url(),
  },

  /**
   * What object holds the environment variables at runtime.
   * For Vite, this is import.meta.env
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. ""), Zod will coerce it to `0`. This is not always
   * desirable.
   *
   * Setting this to `"strict"` will make the validation strictly require
   * defined variables.
   */
  emptyStringAsUndefined: true,

  /**
   * Run validation on app startup to ensure environment variables are set.
   */
  skipValidation: process.env.NODE_ENV === 'development' ? false : true,
});
