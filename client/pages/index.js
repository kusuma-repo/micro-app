import buildClient from '../api/build.client';
const LandingPage = ({ currentuser }) => {
  return currentuser ? (
    <h2> You are succesfully login</h2>
  ) : (
    <h2>You are not login</h2>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
