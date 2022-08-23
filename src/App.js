import { useSelector, useDispatch } from 'react-redux';
import { useEffect, Fragment } from 'react';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

import { uiActions } from './store/ui-slice';
import Notification from './components/UI/Notification';

let isIntial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisiable);

  const cart = useSelector(state => state.cart);

  const notifications = useSelector(state => state.ui.notification);

  // console.log(notifications);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data!',
        })
      );
      const response = await fetch(
        'https://react-http-2f8d5-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        }
      );
      if (!response.ok) {
        throw new Error('Sending cart data failed.!');
      }

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'success!',
          message: 'Sent cart data successfuly!',
        })
      );
    };

    if (isIntial) {
      isIntial = false;
      return;
    }

    sendCartData().catch(error => {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data Failed!',
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notifications && (
        <Notification
          status={notifications.status}
          title={notifications.title}
          message={notifications.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
