import type { OrderBookType } from '@/types/order-book';
import ButtonConfirmGoodsReceived from '@/components/orderbook/buttons/ButtonConfirmGoodsReceived';
import ButtonConfirmOrder from '@/components/orderbook/buttons/ButtonConfirmOrder';
import ButtonFailOrder from '@/components/orderbook/buttons/ButtonFailOrder';
import ButtonMarkAsShipped from '@/components/orderbook/buttons/ButtonMarkAsShipped';
import ButtonReclaimEscrowRent from '@/components/orderbook/buttons/ButtonReclaimEscrowRent';
import ButtonRequestRefund from '@/components/orderbook/buttons/ButtonRequestRefund';
import ButtonWithdrawFunds from '@/components/orderbook/buttons/ButtonWithdrawFunds';

interface OrderRowProps {
  order: OrderBookType;
}

export default function OrderRow({ order }: OrderRowProps) {
  // Placeholder for counterparty and commodity name
  const counterpartyName = 'Counterparty Name';
  const commodityName = 'Commodity Name';

  console.log({ order });

  return (
    <tr>
      <td className="text-center font-medium">{order._id.slice(0, 6)}</td>
      <td>{counterpartyName}</td>
      <td>{commodityName}</td>
      <td>{order.quantity}</td>
      <td>{order.totalAmount}</td>
      <td>{order.status}</td>
      <td className="text-center">
        {/* Action buttons: let each button handle its own visibility */}
        <ButtonConfirmOrder order={order} />
        <ButtonMarkAsShipped order={order} />
        <ButtonConfirmGoodsReceived order={order} />
        <ButtonWithdrawFunds order={order} />
        <ButtonRequestRefund order={order} />
        <ButtonFailOrder order={order} />
        <ButtonReclaimEscrowRent order={order} />
      </td>
    </tr>
  );
}
