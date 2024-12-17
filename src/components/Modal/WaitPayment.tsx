import React, { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { customThemeWaiterModal } from '../../../styles/themes';
import { ITransaction } from '../../types';
import pending from '../../assets/order/pending.svg';
import QRCode from 'qrcode';

type Props = {
  visible: boolean;
  onClose: () => void;
  refetch: (transactionId: any) => void;
  transaction: ITransaction;
};

const base64Types = ['QPay', 'QPay2'];

const Index = ({ visible, onClose, refetch, transaction }: Props) => {
  const { t } = useTranslation('language');
  const [imageqrcUrl, setImageUrl] = useState<string>('');

  const generateUrl = async (data: any) => {
    try {
      const url = await QRCode.toDataURL([{ data: data, mode: 'byte' }], { errorCorrectionLevel: 'M' });
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (transaction && transaction.type === 'UNP') {
      generateUrl(transaction.image);
    }
  }, [transaction]);

  const getImageUrl = (): string => {
    if (base64Types.includes(transaction.type)) {
      return `data:image/jpeg;base64,${transaction.image}`;
    }
    return transaction.type === 'UNP' ? imageqrcUrl : transaction.image;
  };

  const imageUrl = getImageUrl();

  return (
    <Modal show={visible} theme={customThemeWaiterModal} onClose={onClose}>
      <Modal.Body className="p-1">
        <div className="flex place-content-center mt-6">
          <img src={pending.src} className="w-32 h-32 flex md:hidden" />

          <div className=" place-content-center h-full hidden md:flex">
            <img src={imageUrl} className="w-64 h-64" alt="QR Code" />
          </div>
        </div>
        <div className="grid gap-2 place-items-center w-full">
          <span className="text-lg font-normal">Гүйлгээ хүлээгдэж байна</span>
          <span className=" text-sm text-misty font-normal">Гүйлгээ хийгдсэнээр таны захиалга баталгаажна</span>
        </div>
      </Modal.Body>

      <Modal.Footer className="place-content-center">
        <div className="grid gap-2 place-items-center w-full">
          <button
            onClick={onClose}
            className="w-8/12 flex place-content-center justify-center bg-white border border-current p-3 rounded-lg cursor-pointer"
          >
            <span className="block  text-sm text-current   font-semibold ">{t('mainPage.GoBack')}</span>
          </button>
          <div
            onClick={() => refetch(transaction.id)}
            className="w-8/12 flex place-content-center justify-center bg-current p-3 rounded-lg cursor-pointer"
          >
            <span className="block  text-sm text-white   font-semibold ">{t('mainPage.Paid')}</span>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Index;
