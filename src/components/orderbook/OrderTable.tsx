/**
 * OrderTable component
 * Renders a table of orders with headers and clean empty state.
 * @param orders - Array of OrderBookType
 */
import type { OrderBookType } from '@/types/order-book';
import OrderRow from './OrderRow';

interface OrderTableProps {
  orders: OrderBookType[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Order ID</th>
          <th className="px-4 py-2 text-left">Counterparty</th>
          <th className="px-4 py-2 text-left">Commodity</th>
          <th className="px-4 py-2 text-left">Quantity</th>
          <th className="px-4 py-2 text-left">Total Amount</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => <OrderRow key={order._id} order={order} />)
        ) : (
          <tr>
            <td colSpan={7} className="py-8 text-center text-gray-400">
              No order found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
