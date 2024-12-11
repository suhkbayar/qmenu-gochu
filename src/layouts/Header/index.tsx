import { useState } from 'react';
import logo from '../../assets/images/gochu.jpg';
import { FiUser } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const renderMenu = (
    <ul className="flex flex-col  mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
      <li className="border-b-2  border-white">
        <a
          href="#"
          className="block py-2 my-2 text-md pr-4 pl-3 text-white font-bold lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
          aria-current="page"
        >
          Нүүр
        </a>
      </li>
      <li className="content-center">
        <a
          href="#"
          className="block py-2   text-md pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Бидний тухай
        </a>
      </li>
      <li className="content-center">
        <a
          href="#"
          className="block py-2 text-md pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Цагийн хуваарь
        </a>
      </li>
      <li className="content-center">
        <a
          href="#"
          className="block py-2  text-md marker:pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          Холбоо барих
        </a>
      </li>
      <li className="content-center">
        <a
          href="#"
          className="block py-2  text-md marker:pr-4 pl-3 text-white font-bold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
        >
          <FiUser className="text-xl" />
        </a>
      </li>
    </ul>
  );

  return (
    <header className="sticky top-0 w-full z-10 ">
      <nav className="bg-primary  border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            <img src={logo.src} className="mr-3 h-16 rounded-full " alt="Gochu Logo" />
            <span className="self-center text-xl border-gray-800 font-semibold whitespace-nowrap dark:text-white">
              Gochu Korean Chicken
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
