import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [Errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      onSuccess(response.data);
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h3>Oops...</h3>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, Errors };
};
