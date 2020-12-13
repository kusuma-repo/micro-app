import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    /* @descr request made on the server 
       @do get single user
    */
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    /* @descr request made on the browser 
       @do get single user
    */
    return axios.create({
      baseURL: '/',
    });
  }
};
