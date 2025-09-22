import React from 'react';
import { useTranslation } from 'react-i18next';
import { IOrder } from '../../types';
import { DRAFT_TYPE } from '../../constants/constant';

type Props = {
  order: IOrder;
  count: number;
};

const Stepper = ({ order, count }: Props) => {
  const { t } = useTranslation('language');

  const steps = [
    t('mainPage.Received'),
    t('mainPage.Processing'),
    t('mainPage.TheFoodIsReady'),
    order.type === 'Dining' ? t('mainPage.PleaseAcceptYourFood') : t('mainPage.PICKEDUP'),
    t('mainPage.COMPLETED'),
  ];

  return (
    <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
      {steps.map((label, index) => (
        <li className="mb-10 ml-6" key={index}>
          <span
            className={`absolute mt-[-6px] flex items-center justify-center w-8 h-8 ${
              count > index + 1
                ? 'bg-green-200 dark:bg-green-900'
                : count === index + 1
                ? 'bg-current '
                : 'bg-gainsboro border border-grayish'
            } rounded-full -left-4 ring-4 ring-white`}
          >
            {count > index + 1 ? (
              <svg
                className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            ) : (
              <>
                {count === index + 1 && (
                  <>
                    {/* <TfiReload className="text-white animate-spin">2</TfiReload> */}
                    <div className="text-white dark:text-gray-400 ">{count === index + 1 && count}</div>
                  </>
                )}
              </>
            )}
          </span>
          <div className="font-medium text-sm leading-tight">{label}</div>
          {order.state === DRAFT_TYPE.DELIVERING && count === 4 && index === 3 && order.additional && (
            <div className="mt-2 ml-2">
              <span className="text-xs text-misty">{t('mainPage.DeliveryPerson')}: </span>
              <span className="text-xs text-current">{order.additional}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Stepper;
