process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWlRsbU5Ua3dZMkpsWldJek1EQXlNalF3WldKaVpTSXNJbVZ0WVdsc0lqb2lkR1Z6ZEcxbE1rQm5iV0ZwYkM1amIyMGlMQ0pwWVhRaU9qRTJNRGt4TmpneU56VjkuT3E3VHlhUDhQdHlqclY2NnJNekpCTG5kdC16bGhZVllFaUR2eVpST1QtSSJ9';

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 300; i++) {
    doRequest();
  }
})();
