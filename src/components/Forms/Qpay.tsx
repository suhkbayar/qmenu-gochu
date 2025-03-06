import React from 'react';
import { IPayment } from '../../types';
import { PAYMENT_TYPE } from '../../constants/constant';
import { qpyBanks } from '../../mock';
import { ConvertQpayBankImg } from '../../tools/convertImg';

type Props = {
  payment?: IPayment;
  watch: any;
  onSelect: (type: string, id: string) => void;
};

const Index: React.FC<Props> = ({ payment, watch, onSelect }) => {
  const paymentType = watch('paymentType');

  if (!payment?.id) return null;

  return (
    <div className="w-full bg-white rounded-lg  mt-2 ">
      <div className="grid grid-cols-4 gap-6 ">
        {(payment.type === PAYMENT_TYPE.QPay ? qpyBanks : qpyBanks).map((bank, index) => (
          <div
            key={index}
            onClick={() => onSelect(bank.type, payment.id)}
            className={`rounded-lg grid  cursor-pointer place-self-center p-1 bg-gray-50 relative ${
              paymentType === bank.type ? 'border-2 border-current' : ' border-2 border-transparent '
            } `}
          >
            <div className="flex items-center justify-center ">
              <img className={`w-10 rounded-lg `} src={ConvertQpayBankImg(bank.type)} alt={`${bank.type} Bank`} />
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
