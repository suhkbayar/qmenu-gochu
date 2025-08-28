import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useCallStore } from '../../contexts/call.store';
import { getPayload } from '../../providers/auth';
import { useQuery } from '@apollo/client';
import { ME, GET_ORDERS } from '../../graphql/query';
import { isEmpty } from 'lodash';
import { IoArrowBack } from 'react-icons/io5';
import logo from '../../assets/images/newQ.png';
import { ACTIVE_STATES } from '../../constants/constant';

type Props = {
  isBack?: boolean;
  isMain?: boolean;
};

const Header: React.FC<Props> = ({ isBack, isMain }) => {
  const router = useRouter();
  const { participant, setUser, selectedParticipant, order } = useCallStore();
  const [isOpen, setIsOpen] = useState(false);
  const role = getPayload()?.role;

  const { data: userData } = useQuery(ME, {
    skip: role !== 'customer',
    onCompleted: (data) => {
      setUser(data.me);
    },
  });

  const { data: ordersData } = useQuery(GET_ORDERS, {
    skip: !participant?.id,
  });

  const allOrders = ordersData?.getOrders || [];
  // const totalOrdersCount = allOrders.length;
  const activeOrdersCount = allOrders.filter((order: any) => !ACTIVE_STATES.includes(order.state)).length;

  const goUser = () => {
    if (!isEmpty(userData?.me)) {
      router.push(`/profile?id=${participant.id}`);
    } else {
      router.push(`/login?id=${participant.id}`);
    }
  };

  const renderMenu = (
    <ul className="flex flex-col font-medium lg:flex-row lg:space-x-8">
      <li className="border-b-2 border-white lg:border-0">
        <div
          onClick={() => {
            router.push(`branch?id=${participant.id}`);
            setIsOpen(false);
          }}
          className="block py-2 my-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
        >
          Нүүр
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => {
            router.push(`history`);
            setIsOpen(false);
          }}
          className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0 "
        >
          <span className="relative">
            Түүх
            {activeOrdersCount > 0 && (
              <span className="absolute top-0 left-10 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {activeOrdersCount > 99 ? '99+' : activeOrdersCount}
              </span>
            )}
          </span>
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => {
            router.push(`branch-info`);
            setIsOpen(false);
          }}
          className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
        >
          Бидний тухай
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => {
            router.push(`branch-info`);
            setIsOpen(false);
          }}
          className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
        >
          Цагийн хуваарь
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => {
            router.push(`branch-info`);
            setIsOpen(false);
          }}
          className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
        >
          Холбоо барих
        </div>
      </li>
      <li className="content-center">
        {isEmpty(userData?.me) ? (
          <div
            onClick={() => {
              goUser();
              setIsOpen(false);
            }}
            className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
          >
            Нэвтрэх
          </div>
        ) : (
          <div
            onClick={() => {
              goUser();
              setIsOpen(false);
            }}
            className="block py-2 text-md pr-4 pl-3 text-white font-bold lg:text-primary-700 lg:p-0"
          >
            Хэрэглэгчийн мэдээлэл
          </div>
        )}
      </li>
    </ul>
  );

  const goBack = () => {
    router.push(`/`);
  };

  return (
    <header className="sticky top-0 w-full z-50">
      <nav className="bg-primary border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            {isBack && <IoArrowBack onClick={goBack} className="mr-4 text-2xl text-white" />}
            <img
              src={selectedParticipant?.branch.logo ?? participant?.branch.logo}
              className="mr-3 h-14 rounded-xl"
              alt="Gochu Logo"
            />
            <span className="text-xl font-semibold whitespace-nowrap text-white">
              {selectedParticipant?.branch.name ?? 'Онлайн захиалга'}
            </span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 text-sm text-white rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center">{renderMenu}</div>
        </div>
      </nav>

      {/* Right Sidebar Drawer (Mobile only) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-2xl text-white">
            &times;
          </button>
        </div>
        <div className="p-4">{renderMenu}</div>
        <div className="absolute right-0 bottom-2 w-full">
          <div className="flex w-full justify-center">
            <img src={logo.src} className="w-24" onClick={() => router.push('https://qmenu.mn/')} />
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </header>
  );
};

export default Header;
