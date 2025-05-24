import { api } from '../../convex/_generated/api';

/**
 * Shared type for an OrderBook row, based on Convex API return types.
 * This type is a union of the return types from listByBuyer and listBySeller
 * to accommodate the combined list in the OrderBook page.
 * Use this type in all order-related components for strict type safety.
 */
export type OrderBookType =
  | (typeof api.orderbook_queries.listByBuyer._returnType)[number]
  | (typeof api.orderbook_queries.listBySeller._returnType)[number];
