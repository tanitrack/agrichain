import { api } from '../../convex/_generated/api';

/**
 * Shared type for an OrderBook row, based on Convex API return type.
 * Use this type in all order-related components for strict type safety.
 */
export type OrderBookType = typeof api.orderbook_queries.listByBuyer._returnType[number];
