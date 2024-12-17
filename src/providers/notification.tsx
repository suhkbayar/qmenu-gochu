import React, { createContext, useContext, useMemo, useState } from 'react';
import { NotificationType } from '../constants/constant';
import { NotificationModal } from '../components/Modal/NotificationModal';
import { INotification, INotificationAction } from '../types/notification';
import { OrderModal } from '../components/Modal/OrderModal';

interface NotificationsState {
  notifications: INotification[];
  nextToken: string;
  hasMore: boolean;
}

interface NotificationState {
  visible: boolean;
  orderVisible: boolean;
  orderId: string;
  type: NotificationType;
  title?: string;
  message?: string;
  actions?: INotificationAction[];
  loyaltyVisible?: boolean;
  loyaltyType?: string;
  loyaltyImage?: string;
}

const initialState = {
  visible: false,
  orderVisible: false,
  orderId: null,
  type: null,
  title: '',
  message: '',
  actions: null,
  loyaltyVisible: false,
  loyaltyType: 'G',
  loyaltyImage: null,
};

type NotificationContextType = {
  notificationState: NotificationsState;
  setNotificationState: any;
  showNotification: (type: NotificationType, message?: string) => void;
  showCustomNotification: (
    title: any,
    message: string,
    type?: NotificationType,
    actions?: INotificationAction[],
  ) => void;
  showOrderNotification: (orderId: string) => void;
  showLoyaltyNotification: (
    type: string,
    title: string,
    message: string,
    logo: string,
    actions?: INotificationAction[],
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }: any) => {
  const [state, setState] = useState<NotificationState>(initialState);
  const [notificationState, setNotificationState] = useState<NotificationsState>({
    notifications: [],
    nextToken: null,
    hasMore: true,
  });

  const showNotification = (type: NotificationType = NotificationType.SUCCESS, message: string = '') => {
    let title: string = '';
    switch (type) {
      case NotificationType.SUCCESS:
        title = 'Амжилттай';
        break;
      case NotificationType.ERROR:
        title = 'Амжилтгүй';
        break;
      case NotificationType.INFO:
        title = 'Мэдэгдэл';
        break;
      case NotificationType.WARNING:
        title = 'Анхааруулга';
        break;
    }
    setState({ ...state, type, title, message, visible: true });
  };

  const showCustomNotification = (
    title: string = '',
    message: string = '',
    type?: NotificationType,
    actions: INotificationAction[] = [],
  ) => {
    setState({ ...state, type, title, message, visible: true, actions });
  };

  const showOrderNotification = (orderId: string = '') => {
    setState({ ...state, orderId: orderId, orderVisible: true });
  };

  const showLoyaltyNotification = (
    type: string,
    title: string = 'Мэдэгдэл',
    message: string = '',
    image: string = null,
    actions: INotificationAction[] = [],
  ) => {
    setState({ ...state, loyaltyType: type, title, message, loyaltyImage: image, loyaltyVisible: true, actions });
  };

  const onClose = () => setState(initialState);

  const contextValue = useMemo(
    () => ({
      notificationState,
      setNotificationState,
      showNotification,
      showCustomNotification,
      showLoyaltyNotification,
      showOrderNotification,
    }),
    [state, notificationState],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationModal
        visible={state.visible}
        alertType={state.type}
        message={state.message}
        title={state.title}
        onClose={() => onClose()}
        actions={state.actions}
      />

      <OrderModal orderId={state.orderId} orderVisible={state.orderVisible} onClose={() => onClose()} />
    </NotificationContext.Provider>
  );
};
