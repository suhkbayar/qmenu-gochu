import React from 'react';
import { Modal } from 'flowbite-react';
import { customThemeWaiterModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { IOrder } from '../../types';
import OrderReceipt from '../Receipt/order';

type Props = {
  visible: boolean;
  onClose: () => void;
  qrUrl: any;
  order: IOrder;
};

const Index = ({ visible, onClose, order, qrUrl }: Props) => {
  const { t } = useTranslation('language');

  return (
    <Modal show={visible} theme={customThemeWaiterModal} dismissible onClose={() => onClose()}>
      <Modal.Header>
        <span className="text-lg">{t('mainPage.RECEIPT')}</span>
      </Modal.Header>

      <Modal.Body className="p-1">
        <div className="  flex  place-content-center">
          <OrderReceipt qrUrl={qrUrl} order={order} />
        </div>
      </Modal.Body>

      <Modal.Footer className="place-content-center">
        <div className="grid gap-2 place-items-center w-full">
          <div className="w-8/12 flex place-content-center justify-center bg-gray-300 border border-misty p-3 rounded-lg cursor-pointer">
            <span className="block  text-sm text-misty   font-semibold ">Бүртгэх</span>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Index;
