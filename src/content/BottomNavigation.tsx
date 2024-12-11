import { BsInfoCircle } from 'react-icons/bs';
import { FiBox } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { BsCart2 } from 'react-icons/bs';
import { AiOutlineHistory } from 'react-icons/ai';
import { useCallStore } from '../contexts/call.store';
import { isEmpty } from 'lodash';
import { useContext, useState } from 'react';
import { AuthContext } from '../providers/auth';
import { DraftModal } from '../components';

const BottonNavigation = () => {
  const router = useRouter();
  const { qr } = useContext(AuthContext);
  const { order } = useCallStore();
  const [visible, setVisible] = useState(false);
  const onPush = (item: string) => {
    router.push(item);
  };

  const analyticsRoutes = ['/order', '/report'];
  const supplierRoutes = ['/ticket', '/membership', '/users'];
  const artRoutes = ['/art', '/gallery'];

  const goHome = () => {
    if (router.pathname === '/partner') {
      setVisible(true);
    } else {
      router.push(`partner?id=${qr}`);
    }
  };

  return (
    <div className=" fixed   sm:hidden z-20 w-full  h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-t-3xl bottom-0 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex justify-between px-6 items-center h-full max-w-lg mx-auto">
        <div className="flex items-center justify-center w-full h-full" onClick={() => goHome()}>
          <div
            className={`${router.pathname === '/partner' ? 'p-4 rounded-2xl bg-current text-white' : ' text-gray-600'}`}
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
        <div className="flex items-center justify-center w-full h-full" onClick={() => onPush('/order')}>
          <div className={`${analyticsRoutes.includes(router.pathname) ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <AiOutlineHistory size={22} className="text-gray-600" />
          </div>
        </div>

        <div className="flex items-center justify-center w-full h-full" onClick={() => onPush('/ticket')}>
          <div className={`${supplierRoutes.includes(router.pathname) ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <BsInfoCircle size={22} className="text-gray-600" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-full" onClick={() => onPush('/art')}>
          <div className={`${artRoutes.includes(router.pathname) ? 'p-4 rounded-full bg-gray-100' : ''}`}>
            <FiBox size={20} className="text-gray-600" />
          </div>
        </div>
      </div>
      <DraftModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default BottonNavigation;
