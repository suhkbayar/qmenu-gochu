import React from 'react';
import { AiOutlineInbox } from 'react-icons/ai';

const Empty = () => {
  return (
    <>
      <div
        role="status"
        className="p-4 space-y-4 flex place-content-center place-items-center w-full  h-[30vh] rounded    animate-pulse dark:divide-gray-700 md:p-6 md:w-full dark:border-gray-700"
      >
        <div className="text-center grid place-items-center">
          <AiOutlineInbox className="text-gray-700 w-20 h-20" />
          <span className="text-gray1">Олдсонгүй...</span>
        </div>
      </div>
    </>
  );
};

export default Empty;
