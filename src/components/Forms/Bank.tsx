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
    <div className="w-full bg-white rounded-lg  mt-2 ">
      <div className="grid grid-cols-4 gap-6 ">
        {banks.map((bank, index) => (
          <div
            key={index}
            onClick={() => onSelect(bank.type, bank.id)}
            className={`rounded-lg grid  cursor-pointer place-self-center p-1 bg-gray-50 relative ${
              paymentType === bank.type ? 'border-2 border-current' : ' border-2 border-transparent '
            } `}
          >
            <div className="flex items-center justify-center ">
              <img className={`w-10 rounded-lg `} src={ConvertBankImg(bank.type)} alt={`${bank.type} Bank`} />
            </div>

            <span className="line-clamp-1 content-center w-16 mt-1 text-center  text-xs text-gray-600">
              {bank.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
