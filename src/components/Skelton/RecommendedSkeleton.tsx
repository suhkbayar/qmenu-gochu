import React from 'react';

const RecommendedSkeleton = () => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3].map((item) => (
        <div key={item} className="min-w-[180px] max-w-[180px]">
          <div className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-[100px] w-full mb-2"></div>
            <div className="bg-gray-300 rounded h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-300 rounded h-3 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedSkeleton;
