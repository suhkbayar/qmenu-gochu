import { Alert, Modal } from 'flowbite-react';
import { customAlertModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { BsFillInfoCircleFill } from 'react-icons/bs';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const BusyConfirm = ({ visible, onClose, onConfirm }: Props) => {
  const { t } = useTranslation('language');

  return (
    <Modal
      theme={customAlertModal}
      className={`w-full p-0  `}
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <div>
        <Modal.Body>
          <div className="h-fit overflow-auto">
            <Alert color="warning" rounded icon={BsFillInfoCircleFill}>
              <span className="font-medium text-md">
                Замын хөдөлгөөний ачааллын улмаас таны хүргэлт 30-60 минут хоцрох боломжтойг анхаарна уу!
              </span>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer className="   bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full p-4 flex justify-between text-sm place-items-center">
            <button
              onClick={() => onClose()}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: 
          bg-gray-300 text-gray-500
             px-4 py-4 text-sm`}
            >
              Буцах
            </button>
            <button
              onClick={() => onConfirm()}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: bg-current text-white px-4 py-4 text-sm`}
            >
              {t('mainPage.ToBeContinued')}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default BusyConfirm;
