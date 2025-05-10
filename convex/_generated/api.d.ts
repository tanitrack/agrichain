/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as constants from "../constants.js";
import type * as corsHeaders from "../corsHeaders.js";
import type * as harga_komoditas_mutations from "../harga_komoditas_mutations.js";
import type * as harga_komoditas_queries from "../harga_komoditas_queries.js";
import type * as http from "../http.js";
import type * as komoditas_mutations from "../komoditas_mutations.js";
import type * as komoditas_queries from "../komoditas_queries.js";
import type * as orderbook_mutations from "../orderbook_mutations.js";
import type * as orderbook_queries from "../orderbook_queries.js";
import type * as transaction_mutations from "../transaction_mutations.js";
import type * as transaction_queries from "../transaction_queries.js";
import type * as users from "../users.js";
import type * as users_mutations from "../users_mutations.js";
import type * as users_queries from "../users_queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  constants: typeof constants;
  corsHeaders: typeof corsHeaders;
  harga_komoditas_mutations: typeof harga_komoditas_mutations;
  harga_komoditas_queries: typeof harga_komoditas_queries;
  http: typeof http;
  komoditas_mutations: typeof komoditas_mutations;
  komoditas_queries: typeof komoditas_queries;
  orderbook_mutations: typeof orderbook_mutations;
  orderbook_queries: typeof orderbook_queries;
  transaction_mutations: typeof transaction_mutations;
  transaction_queries: typeof transaction_queries;
  users: typeof users;
  users_mutations: typeof users_mutations;
  users_queries: typeof users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
