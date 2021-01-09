import React, { useState } from 'react';
import useRequest from '../../hooks/use.request';
import Router from 'next/router';
const NewTicket = () => {
  const [title, settitle] = useState('');
  const [price, setprice] = useState('');
  const { doRequest, Errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN) {
      return;
    }
    setprice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create NewTicket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setprice(e.target.value)}
            className="form-control"
            onBlur={onBlur}
          />
        </div>
        {Errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
