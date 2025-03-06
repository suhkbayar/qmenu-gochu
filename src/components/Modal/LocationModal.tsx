import React from 'react';

interface LocationModalProps {
  onAllow: () => void;
  onDeny: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ onAllow, onDeny }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center mx-3  ">
        <h2 className="text-lg font-semibold mb-4">Байршлын хандалтыг идэвхжүүлэх</h2>
        <p className="text-gray-700 mb-4">Бидэнд илүү сайн үйлчилгээ үзүүлэхийн тулд таны байршил хэрэгтэй.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onAllow} className="bg-current text-white px-4 py-2 rounded-md">
            Зөвшөөрөх
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
