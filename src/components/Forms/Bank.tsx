import React from 'react';
import checkImage from './img/Check.png';
import { isEmpty } from 'lodash';
import { ConvertBankImg } from '../../tools/convertImg';

type Bank = {
  type: string;
  id: string;
};

type Props = {
  watch: any;
  onSelect: (type: string, id: string) => void;
  banks: Bank[];
};

const Index: React.FC<Props> = ({ watch, onSelect, banks }) => {
  const paymentType = watch('paymentType');
  if (isEmpty(banks)) return null;

  return (
    <div className="w-full bg-white rounded-lg p-2 mt-4">
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {banks.map((bank, index) => (
          <div
            key={index}
            onClick={() => onSelect(bank.type, bank.id)}
            className="rounded-lg flex place-self-center relative"
          >
            {paymentType === bank.type && (
              <img className="absolute mt-1.5 ml-1.5 w-4" src={checkImage.src} alt="Checkmark" />
            )}
            <img
              className={`w-16 rounded-lg ${paymentType === bank.type ? 'border-4 border-current' : ''}`}
              src={ConvertBankImg(bank.type)}
              alt={`${bank.type} Bank`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
