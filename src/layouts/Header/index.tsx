import { useState } from 'react';
import logo from '../../assets/images/gochu.jpg';
import { FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useCallStore } from '../../contexts/call.store';
import { getPayload } from '../../providers/auth';
import { useQuery } from '@apollo/client';
import { ME } from '../../graphql/query';
import { isEmpty } from 'lodash';
const Header = () => {
  const router = useRouter();
  const { participant, setUser } = useCallStore();
  const [isOpen, setIsOpen] = useState(false);
  const role = getPayload()?.role;

  const { data: userData } = useQuery(ME, {
    skip: role !== 'customer',
    onCompleted: (data) => {
      setUser(data.me);
    },
  });

  const goUser = () => {
    if (!isEmpty(userData?.me)) {
      router.push(`/profile?id=${participant.id}`);
    } else {
      router.push(`/login?id=${participant.id}`);
    }
  };

  const renderMenu = (
    <ul className="flex flex-col  mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
      <li className="border-b-2  border-white">
        <div
          onClick={() => router.push(`branch?id=${participant.id}`)}
          className="block py-2 my-2 text-md pr-4 pl-3 text-white font-bold lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
          aria-current="page"
        >
          Нүүр
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => router.push(`branch-info`)}
          className="block py-2   text-md pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Бидний тухай
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => router.push(`branch-info`)}
          className="block py-2 text-md pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Цагийн хуваарь
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => router.push(`branch-info`)}
          className="block py-2  text-md marker:pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Холбоо барих
        </div>
      </li>
      <li className="content-center">
        <div
          onClick={() => goUser()}
          className="block py-2  text-md marker:pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          <FiUser className="text-xl" />
        </div>
      </li>
    </ul>
  );

  return (
    <header className="sticky top-0 w-full z-10 ">
      <nav className="bg-primary  border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            <img src={participant?.branch.logo} className="mr-3 h-16 rounded-full " alt="Gochu Logo" />
            <span className="self-center text-xl border-gray-800 font-semibold whitespace-nowrap dark:text-white">
              {participant?.branch.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {isOpen && (
            <div className=" justify-between items-center w-full lg:flex lg:w-auto lg:order-1">{renderMenu}</div>
          )}
          <div className="  hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">{renderMenu}</div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
