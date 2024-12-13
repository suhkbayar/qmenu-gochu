import React from 'react';
import { Modal } from 'flowbite-react';
import { customAlertModal } from '../../../styles/themes';
import error from '../../assets/icons/error.svg';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { NotificationActionType, NotificationType } from '../../constants/constant';
import { INotificationAction } from '../../types/notification';
import { useRouter } from 'next/router';

export const NotificationModal = ({ visible, alertType, message, onClose, title, actions }) => {
  const router = useRouter();

  const renderFooter = () => {
    const renderItem = (item?: INotificationAction) => {
      let action = async () => {
        if (item?.type === NotificationActionType.L) await router.push(item.value);
        // {} else ...
        onClose();
      };

      return (
        <div
          key={`${item?.type}${item?.value}`}
          onClick={action}
          className={`w-5/12 flex place-content-center justify-center border border-current p-3 rounded-lg cursor-pointer ${
            item?.type === NotificationActionType.P ? 'bg-current' : 'bg-white'
          }`}
        >
          <span
            className={`block  text-sm font-semibold ${
              item?.type === NotificationActionType.P ? 'text-white ' : 'text-current '
            }`}
          >
            {item?.name || 'Хаах'}
          </span>
        </div>
      );
    };

    let renderItems = actions?.map((action) => renderItem(action)) || [renderItem()];

    return <div className="flex justify-center items-center w-full gap-3">{renderItems.map((item) => item)}</div>;
  };

  return (
    <Modal style={{ zIndex: 100 }} dismissible show={visible} popup theme={customAlertModal} onClose={() => onClose()}>
      <Modal.Header className="h-0 z-10" />
      <Modal.Body className="p-3">
        {alertType && (
          <div className="flex place-content-center">
            {alertType === NotificationType.ERROR && <img src={error.src} />}
            {alertType === NotificationType.SUCCESS && (
              <div className=" h-24 w-24">
                <AiOutlineCheckCircle className="text-success text-2xl h-full w-full " />
              </div>
            )}

            {alertType === NotificationType.WARNING && (
              <div className=" h-24 w-24">
                <AiOutlineWarning className="text-coral text-2xl h-full w-full " />
              </div>
            )}
          </div>
        )}
        <div className="grid gap-2 place-items-center w-full">
          <span className="text-xl text-misty font-normal">{title}</span>
          <span className=" text-sm text-center text-misty font-normal">{message} </span>
        </div>
      </Modal.Body>

      <Modal.Footer className="place-content-center p-3">{renderFooter()}</Modal.Footer>
    </Modal>
  );
};
