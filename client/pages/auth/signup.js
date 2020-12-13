import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use.request';
export default () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const { doRequest, Errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <h1>Sign Up</h1>
        {Errors}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Sign Up</button>
      </div>
    </form>
  );
};
