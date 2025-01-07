import React, { useContext, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { ON_UPDATED_ORDER } from '../graphql/subscription/order';
import { IOrder } from '../types';
import { GET_ORDERS } from '../graphql/query';
import { AuthContext, getPayload } from './auth';

const SubscriptionProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const customerId = isAuthenticated ? getPayload()?.sub : null;

  useSubscription(ON_UPDATED_ORDER, {
    variables: { customer: customerId },
    skip: !customerId, // Avoids running the subscription if customerId is null
    onData({ client, data }) {
      if (!data) return;

      const caches = client.readQuery<{ getOrders: IOrder[] }>({ query: GET_ORDERS });
      if (!caches || !caches.getOrders) return;

      const { event, order: subscriptionOrder } = data.data.onUpdatedOrder;
      let updatedOrders = [...caches.getOrders];

      switch (event) {
        case 'CREATED':
        case 'UPDATED':
          if (!updatedOrders.find((order) => order?.id === subscriptionOrder.id)) {
            updatedOrders.push(subscriptionOrder);
          } else {
            updatedOrders = updatedOrders.map((order) =>
              order?.id === subscriptionOrder.id ? subscriptionOrder : order,
            );
          }
          break;
        case 'DELETE':
          updatedOrders = updatedOrders.filter((order) => order?.id !== subscriptionOrder.id);
          break;
        default:
          return;
      }

      client.writeQuery({
        query: GET_ORDERS,
        data: { getOrders: updatedOrders },
      });
    },
  });

  useEffect(() => {
    // Clean up or additional logic if necessary
    return () => {
      // Perform cleanup if needed
    };
  }, []); // Ensure useEffect is not conditional

  return <>{children}</>;
};

export default SubscriptionProvider;
