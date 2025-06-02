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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EscrowState, getEscrowStateInfo } from '@/lib/solana-lib/states-text';
import { Info } from 'lucide-react';

interface OrderRowProps {
  order: OrderBookListItemType;
}

export default function OrderRow({ order }: OrderRowProps) {
  const participant = 'buyer' in order ? order.buyer : order.seller;
  const escrowStateInfo = getEscrowStateInfo(order.status as EscrowState);

  return (
    <tr>
      <td className="text-center font-medium">{order._id.slice(0, 6)}</td>
      <td>{participant.name}</td>
      <td>{order.komoditas?.name}</td>
      <td>{order.quantity}</td>
      <td>{order.totalAmount}</td>
      <td>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1">
                {escrowStateInfo?.title || order.status}
                <Info className="h-4 w-4 text-gray-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{escrowStateInfo?.description || 'Unknown status'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
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
