import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';
import buildClient from '../api/build.client';

const AppComponent = ({ Component, pageProps, currentuser }) => {
  return (
    <div>
      <Header currentuser={currentuser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps, ...data };
};

export default AppComponent;
