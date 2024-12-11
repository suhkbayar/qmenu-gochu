import { Modal } from 'flowbite-react';
import { customThemeDraftModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { useCallStore } from '../../contexts/call.store';
import { isEmpty } from 'lodash';
import { IoIosClose } from 'react-icons/io';
import { CiTrash } from 'react-icons/ci';
import { CURRENCY } from '../../constants/currency';
type Props = {
  visible: boolean;
  onClose: () => void;
};

const DraftModal = ({ visible, onClose }: Props) => {
  const { t } = useTranslation('language');
  const { order, remove, participant } = useCallStore();

  const products = participant?.menu?.categories.flatMap((category) => {
    return [...category.products, ...category.children.flatMap((child) => child.products)];
  });

  return (
    <Modal
      theme={customThemeDraftModal}
      className={`w-full p-0 animate__animated animate__fadeIn `}
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <div>
        <Modal.Header className="bg-current ">
          <span className="text-lg text-white">{t('mainPage.MyOrder')}</span>
        </Modal.Header>
        <Modal.Body>
          <div className="max-h-[28rem] overflow-auto">
            {!isEmpty(order?.items) && (
              <div className="grid gap-4 p-4">
                {order?.items.map((item: any) => (
                  <div className="grid grid-cols-6 gap-4">
                    <div className="flex col-span-1 justify-between items-center">
                      <img
                        className=" rounded-xl "
                        src={products.find((product) => product.productId === item?.productId)?.image}
                      />
                    </div>

                    <span className="col-span-3 flex self-center items-center font-semibold text-gray-700">
                      {item.quantity} <IoIosClose /> {item.name}
                    </span>
                    <div className="flex col-span-2 justify-between items-center">
                      <span>{item.price.toLocaleString()} ₮</span>
                      <CiTrash onClick={() => remove(item)} className="text-lg text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="  absolute bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full  flex justify-between text-sm place-items-center">
            <span className="block text-current font-semibold">
              {order?.totalAmount.toLocaleString()} {CURRENCY}
            </span>
            <button
              onClick={() => {}}
              className="flex font-semibold cursor-pointer place-content-center items-center rounded-lg border border-current px-4 py-4 text-white bg-current text-sm"
            >
              {t('mainPage.ToBeContinued')}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default DraftModal;
