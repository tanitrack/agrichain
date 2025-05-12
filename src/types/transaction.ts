import { api } from '../../convex/_generated/api';

/**
 * Shared type for a Transaction row, based on Convex API return type.
 * Use this type in all transaction-related components for strict type safety.
 */
export type TransactionType = typeof api.transaction_queries.list._returnType['page'][number];
