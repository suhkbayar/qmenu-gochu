import { Modal } from 'flowbite-react';
import { customThemeDraftModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { useCallStore } from '../../contexts/call.store';
import { isEmpty } from 'lodash';
import { IoIosClose } from 'react-icons/io';
import { CiTrash } from 'react-icons/ci';
import { CURRENCY } from '../../constants/currency';
import { useRouter } from 'next/router';
import { getPayload } from '../../providers/auth';
import { useQuery } from '@apollo/client';
import { ME } from '../../graphql/query';
import { useNotificationContext } from '../../providers/notification';
import { NotificationActionType } from '../../constants/constant';
import validateLogin from '../../assets/user/login.svg';
import { useState } from 'react';
import MinAmoiuntWarning from './MinAmountWarning';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const DraftModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { showCustomNotification } = useNotificationContext();
  const { order, remove, participant } = useCallStore();
  const [visibleMinAmount, setVisibleMinAmount] = useState(false);

  const role = getPayload()?.role;

  const { data: userData } = useQuery(ME, {
    skip: role !== 'customer',
  });

  const products = participant?.menu?.categories.flatMap((category) => {
    return [...category.products, ...category.children.flatMap((child) => child.products)];
  });

  const goDelivery = () => {
    if (order?.items.length === 0) return;
    if (!isEmpty(userData?.me)) {
      let totalAmount = order?.items?.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0) || 0;
      if (totalAmount < 35000) {
        setVisibleMinAmount(true);
      } else {
        router.push(`/delivery-type?id=${id}`);
      }
    } else {
      showCustomNotification(
        <div>
          <img src={validateLogin.src} className="w-16 h-16 text-current" />
        </div>,
        'Та эхлээд нэвтрэх хэрэгтэй',
        null,
        [{ name: 'Нэвтрэх', value: `/login?id=${id}`, type: NotificationActionType.L, mutation: '', variables: '' }],
      );
    }
  };

  return (
    <Modal
      theme={customThemeDraftModal}
      className={`w-full p-0  `}
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
                  <div className="grid w-full border-b border-gray-200 ">
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
                    {item.options.length > 0 && (
                      <div className="grid ml-14 ">
                        {item.options.map((option: any) => (
                          <span className="text-sm text-gray-500">
                            -{option.name}: {option.value ?? ''}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mb-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="  absolute bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full p-4 flex justify-between text-sm place-items-center">
            <div className="flex gap-4">
              {order?.items.length > 0 && (
                <>
                  <span className="text-current text-md font-semibold">{t('mainPage.Total')}</span>
                  <span className="block text-current text-md font-semibold">
                    {order?.totalAmount.toLocaleString()} {CURRENCY}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => goDelivery()}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: ${
                order?.items.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              {t('mainPage.ToBeContinued')}
            </button>
          </div>
        </Modal.Footer>
      </div>
      <MinAmoiuntWarning
        onClose={() => {
          setVisibleMinAmount(false);
          onClose();
        }}
        visible={visibleMinAmount}
      />
    </Modal>
  );
};

export default DraftModal;
