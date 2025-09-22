import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_ORDER } from '../../../graphql/query';
import { useNotificationContext } from '../../../providers/notification';
import { NotificationType } from '../../../constants/constant';
import { useCallStore } from '../../../contexts/call.store';
import { Loader, Step } from '../../../components';
import done from '../../../assets/order/done.svg';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '../../../constants/currency';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { showNotification } = useNotificationContext();
  const { participant, removeOrder } = useCallStore();

  const { loading, data } = useQuery(GET_ORDER, {
    skip: !id,
    variables: { id: id },
    onError(err) {
      showNotification(NotificationType.ERROR, err.message);

      if (participant) {
        router.push(`/restaurant?id=${participant.id}`);
      }
    },
    onCompleted: (data) => {
      if (data?.getOrder.paymentState === 'PAID') {
      }
    },
  });

  const goBack = () => {
    removeOrder();
    router.push(`/partner?id=${participant.id}`);
  };

  if (loading) return <Loader />;

  return (
    <section className="flex w-full justify-center bg-gray-50">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="w-full pt-4 px-4 bg-white">
          <Step totalSteps={participant?.vat ? 5 : 4} activeStep={participant?.vat ? 5 : 4} />
        </div>

        <div className="w-full grid gap-4 px-4 pt-10 pb-8 bg-white rounded-b-3xl  ">
          <div className="flex w-full items-center justify-center ">
            <div className="border-8 border-green-100 rounded-full">
              <img src={done.src} className="w-20 h-20" />
            </div>
          </div>
          <div className="flex w-full items-center justify-center ">
            <span className="text-2xl text-gray-600  font-semibold ">#{data?.getOrder?.number?.slice(-4)}</span>
          </div>
          <div className="flex w-full items-center justify-center ">
            <span className="text-2xl text-gray-600  font-semibold ">Төлбөр амжилттай</span>
          </div>
        </div>

        <div className="w-full grid gap-4 px-4 pt-10 pb-8  ">
          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Захиалгын төлөв:</span>

            <span className="text-sm text-gray-500">{t(`mainPage.${data?.getOrder.state}`)}</span>
          </div>
          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Хүргэгдэх хаяг:</span>
            <span className="text-sm text-gray-500 line-clamp-2">{data?.getOrder.address}</span>
          </div>
          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Хүргэх хугацаа:</span>
            <span className="text-sm text-gray-500 line-clamp-2">
              {data?.getOrder?.deliveryDate === 'ASAP' ? t('mainPage.ASAP') : data?.getOrder?.deliveryDate}
            </span>
          </div>

          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Хөнглөлт:</span>
            <span className="text-sm text-gray-500 line-clamp-2">
              {data?.getOrder?.discountAmount.toLocaleString()} {CURRENCY}
            </span>
          </div>

          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Татвар:</span>
            <span className="text-sm text-gray-500 line-clamp-2">
              {data?.getOrder?.taxAmount.toLocaleString()} {CURRENCY}
            </span>
          </div>

          <div className="flex w-full justify-between ">
            <span className="text-sm text-gray-500">Төлөгдсөн дүн:</span>
            <span className="text-sm text-gray-500 line-clamp-2">
              {data?.getOrder?.paidAmount.toLocaleString()} {CURRENCY}
            </span>
          </div>
        </div>

        <div className="absolute bg-white bottom-0 w-full border-t border-gray-100 p-4">
          <div className="w-full flex justify-end text-sm place-items-center">
            <button
              onClick={() => goBack()}
              className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg bg-current text-white px-4 py-4 text-sm`}
            >
              <span>Нүүр хуудас</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
