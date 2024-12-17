import { BsInfoCircle } from 'react-icons/bs';
import { FiBox } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { BsCart2 } from 'react-icons/bs';
import { AiOutlineHistory } from 'react-icons/ai';
import { useCallStore } from '../contexts/call.store';
import { isEmpty } from 'lodash';
import { useContext, useState } from 'react';
import { AuthContext, getPayload } from '../providers/auth';
import { DraftModal } from '../components';
import { FiUser } from 'react-icons/fi';
import { useQuery } from '@apollo/client';
import { GET_ORDERS, ME } from '../graphql/query';

const BottonNavigation = () => {
  const router = useRouter();
  const { qr } = useContext(AuthContext);
  const { order, setUser } = useCallStore();
  const [visible, setVisible] = useState(false);
  const role = getPayload()?.role;
  const { data: orders } = useQuery(GET_ORDERS);

  const { data: userData } = useQuery(ME, {
    skip: role !== 'customer',
    onCompleted: (data) => {
      setUser(data.me);
    },
  });

  const onPush = (item: string) => {
    router.push(item);
  };

  const supplierRoutes = ['/ticket', '/membership', '/users'];
  const artRoutes = ['/art', '/gallery'];

  const goHome = () => {
    if (router.pathname === '/branch') {
      setVisible(true);
    } else {
      router.push(`branch?id=${qr}`);
    }
  };

  const goUser = () => {
    if (!isEmpty(userData?.me)) {
      router.push(`/profile?id=${qr}`);
    } else {
      router.push(`/login?id=${qr}`);
    }
  };

  const paidOrdersCount = orders?.getOrders?.filter((order: any) => order.paymentState === 'PAID').length;

  return (
    <div className=" fixed   sm:hidden z-20 w-full  h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-t-3xl bottom-0 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex justify-between px-6 items-center h-full max-w-lg mx-auto">
        <div className="flex items-center justify-center w-full h-full" onClick={() => goHome()}>
          <div
            className={`${router.pathname === '/branch' ? 'p-4 rounded-2xl bg-current text-white' : ' text-gray-600'}`}
          >
            <div className="relative">
              <BsCart2 size={20} className="" />
              {!isEmpty(order?.items) && (
                <span className="absolute bg-[#f43f5e] top-0 right-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2  text-white">
                  {order?.items?.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-full" onClick={() => onPush('/history')}>
          <div className={`${router.pathname === '/history' ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <div className="relative">
              <AiOutlineHistory size={22} className="text-gray-600" />

              {paidOrdersCount > 0 && (
                <span className="absolute bg-[#f43f5e] top-0 right-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2  text-white">
                  {paidOrdersCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full h-full" onClick={() => onPush('/ticket')}>
          <div className={`${supplierRoutes.includes(router.pathname) ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <BsInfoCircle size={22} className="text-gray-600" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-full" onClick={() => goUser()}>
          <div className={`${artRoutes.includes(router.pathname) ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <FiUser size={22} className="text-gray-600" />
          </div>
        </div>
      </div>
      <DraftModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default BottonNavigation;
