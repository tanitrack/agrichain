import type { OrderBookListItemType } from '@/types/order-book';
import ButtonConfirmGoodsReceived from '@/components/orderbook/buttons/ButtonConfirmGoodsReceived';
import ButtonConfirmOrder from '@/components/orderbook/buttons/ButtonConfirmOrder';
import ButtonFailOrder from '@/components/orderbook/buttons/ButtonFailOrder';
import ButtonMarkAsShipped from '@/components/orderbook/buttons/ButtonMarkAsShipped';
import ButtonReclaimEscrowRent from '@/components/orderbook/buttons/ButtonReclaimEscrowRent';
import ButtonRequestRefund from '@/components/orderbook/buttons/ButtonRequestRefund';
import ButtonWithdrawFunds from '@/components/orderbook/buttons/ButtonWithdrawFunds';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OrderRowProps {
  order: OrderBookListItemType;
}

export default function OrderRow({ order }: OrderRowProps) {
  const participant = 'buyer' in order ? order.buyer : order.seller;

  return (
    <tr>
      <td className="text-center font-medium">{order._id.slice(0, 6)}</td>
      <td>{participant.name}</td>
      <td>{order.komoditas?.name}</td>
      <td>{order.quantity}</td>
      <td>{order.totalAmount}</td>
      <td>{order.status}</td>
      <td className="text-center">
        {/* Action buttons: let each button handle its own visibility */}
        <Button asChild>
          <Link to={`/order-book/${order._id}`}>Detail</Link>
        </Button>
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
