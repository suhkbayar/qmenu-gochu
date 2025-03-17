import { Alert, Modal } from 'flowbite-react';
import { customAlertModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { BsFillInfoCircleFill } from 'react-icons/bs';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MinAmoiuntWarning = ({ visible, onClose }: Props) => {
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
                Та 35000₮-с дээш үнийн дүнгээр хүргэлтийн захиалах хийх боломжтой.
              </span>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer className="   bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full p-4 flex justify-between text-sm place-items-center">
            <button
              onClick={() => onClose()}
              className={`flex w-full font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: bg-current text-white px-4 py-4 text-sm`}
            >
              Нэмж захиалах
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default MinAmoiuntWarning;
