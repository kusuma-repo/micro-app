import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use.request';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
const OrderShow = ({ order, currentuser }) => {
  console.log(order);
  const [timeLeft, settimeLeft] = useState(0);
  const { doRequest, Errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const expiration = new Date(order.expiresAt) - new Date();
      settimeLeft(Math.round(expiration / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft < 0) {
    return <div>Opps </div>;
  }
  return (
    <div>
      <h4> Time left to pay: {timeLeft} seconds</h4>

      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Hd6VDDxAX8ghbPPSn8rA1agCDNP4J8CS8mhOOx5E9kzGAhlaRW8BVhLsZyoVE0xN4r4vyub9koRH97DfSpmw3Gl00UsnQTiUc"
        amount={order.ticket.price * 100}
        email={currentuser.email}
      />
      {Errors}
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  console.log(context.query);
  const { orderid } = context.query;
  const { data } = await client.get(`/api/orders/${orderid}`);

  return { order: data };
};
export default OrderShow;
