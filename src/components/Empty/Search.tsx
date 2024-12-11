import React from 'react';
import { MdSearchOff } from 'react-icons/md';

const SearchEmpty = () => {
  return (
    <>
      <div
        role="status"
        className="p-4 space-y-4 flex place-content-center place-items-center w-full  h-[50vh] rounded    animate-pulse dark:divide-gray-700 md:p-6 md:w-full dark:border-gray-700"
      >
        <div>
          <MdSearchOff className="text-gray-700 w-32 h-32" />
          <span className="text-gray1">Олдсонгүй...</span>
        </div>
      </div>
    </>
  );
};

export default SearchEmpty;
