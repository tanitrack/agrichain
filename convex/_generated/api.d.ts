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
import type * as harga_komoditas_mutations from "../harga_komoditas_mutations.js";
import type * as harga_komoditas_queries from "../harga_komoditas_queries.js";
import type * as komoditas_mutations from "../komoditas_mutations.js";
import type * as komoditas_queries from "../komoditas_queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  harga_komoditas_mutations: typeof harga_komoditas_mutations;
  harga_komoditas_queries: typeof harga_komoditas_queries;
  komoditas_mutations: typeof komoditas_mutations;
  komoditas_queries: typeof komoditas_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
