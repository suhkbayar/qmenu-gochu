import { BsInfoCircle, BsCart2 } from 'react-icons/bs';
import { AiOutlineHistory } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useCallStore } from '../contexts/call.store';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { getPayload } from '../providers/auth';
import { DraftModal } from '../components';
import { useQuery } from '@apollo/client';
import { GET_ORDERS, ME } from '../graphql/query';
import MinAmountWarning from '../components/Modal/MinAmountWarning';
import { useTranslation } from 'react-i18next';
import { ACTIVE_STATES } from '../constants/constant';

const BottomNavigation = () => {
  const router = useRouter();
  const { order, setUser, participant } = useCallStore();
  const [visible, setVisible] = useState(false);
  const [visibleMinAmount, setVisibleMinAmount] = useState(false);
  const { t } = useTranslation('language');
  const role = getPayload()?.role;

  const { data: userData } = useQuery(ME, {
    skip: role !== 'customer',
    onCompleted: (data) => setUser(data.me),
  });

  const { data: ordersData } = useQuery(GET_ORDERS, {
    skip: !participant?.id,
  });

  const allOrders = ordersData?.getOrders || [];
  const activeOrdersCount = allOrders.filter((order: any) => !ACTIVE_STATES.includes(order.state)).length;

  const goHome = () => {
    if (router.pathname === '/branch') {
      let totalAmount = order?.items?.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0) || 0;

      if (totalAmount < 35000) {
        setVisibleMinAmount(true);
      } else {
        setVisible(true);
      }
    } else {
      router.push(`branch?id=${participant.id}`);
    }
  };

  const goUser = () => {
    if (!isEmpty(userData?.me)) {
      router.push(`/profile?id=${participant.id}`);
    } else {
      router.push(`/login?id=${participant.id}`);
    }
  };

  const tabs = [
    {
      path: '/branch',
      label: t('mainPage.Order'),
      onClick: goHome,
      icon: BsCart2,
      size: 20,
      badge: !isEmpty(order?.items) ? order?.items?.length : 0,
    },
    {
      path: '/history',
      label: t('mainPage.OrderHistoryShort'),
      onClick: () => router.push('/history'),
      icon: AiOutlineHistory,
      size: 22,
      badge: activeOrdersCount,
    },
    {
      path: '/branch-info',
      label: t('mainPage.Info'),
      onClick: () => router.push('/branch-info'),
      icon: BsInfoCircle,
      size: 22,
    },
    {
      path: '/user',
      label: t('mainPage.User'),
      onClick: goUser,
      icon: FiUser,
      size: 22,
    },
  ];

  return (
    <>
      <div className="fixed sm:hidden z-20 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-t-3xl bottom-0 left-1/2">
        <div className="flex justify-between px-6 items-center h-full max-w-lg mx-auto">
          {tabs.map(({ path, label, onClick, icon: Icon, size, badge }) => {
            const isActive = router.pathname === path;
            return (
              <button
                key={path}
                onClick={onClick}
                className="flex flex-col items-center justify-center w-full h-full focus:outline-none"
              >
                <div className="relative flex flex-col items-center">
                  <Icon size={size} className={isActive ? 'text-current' : 'text-gray-600'} />
                  {badge > 0 && (
                    <span className="absolute bg-[#f43f5e] top-0 right-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 text-white">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-current font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <DraftModal visible={visible} onClose={() => setVisible(false)} />
      <MinAmountWarning onClose={() => setVisibleMinAmount(false)} visible={visibleMinAmount} />
    </>
  );
};

export default BottomNavigation;
