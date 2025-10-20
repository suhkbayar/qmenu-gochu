import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_ORDER } from '../../graphql/query';
import useNotificationStore from '../../contexts/notificationStore';
import { useCallStore } from '../../contexts/call.store';
import { BankFrom, QpayForm, Step, WaitPaymentModal } from '../../components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { GET_PAY_ORDER, VALIDATE_TRANSACTION } from '../../graphql/mutation/order';
import { ITransaction } from '../../types';
import { CARD_PAYMENTS, NotificationType, PAYMENT_TYPE } from '../../constants/constant';
import { CURRENCY } from '../../constants/currency';
import { isEmpty } from 'lodash';
import { FiEdit3 } from 'react-icons/fi';
import toLocation from '../../assets/delivery/to_location.svg';
import timer from '../../assets/delivery/timer.svg';
import { useNotificationContext } from '../../providers/notification';
import moment from 'moment';

const filterBanks = ['QPay', 'UPT', 'Upoint', 'QPay2', 'GLP'];

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const [visiblePending, setVisiblePending] = useState(false);
  const { showAlert } = useNotificationStore();
  const [transaction, setTransaction] = useState<ITransaction>();
  const { showNotification, showCustomNotification } = useNotificationContext();
  const { participant, order: orderStore } = useCallStore();
  const { register, handleSubmit, reset, setValue, watch } = useForm<FieldValues>({
    mode: 'onSubmit',
  });

  const [payOrderByPayment, { loading: paying }] = useMutation(GET_PAY_ORDER, {
    onCompleted: (data) => {
      setTransaction(data.payOrder.transaction);

      let link = null;
      if (data.payOrder.transaction.links) {
        link = data.payOrder.transaction.links.find(
          (link) => link.name.toUpperCase() === paymentType.toUpperCase(),
        )?.link;
      }
      if (link) {
        window.location.href = link;
        setVisiblePending(true);
      } else {
        showNotification(NotificationType.ERROR, 'Payment link not found'); // Handle the case when the link is not found
      }
    },
    onError(err) {
      showAlert(true, 'error', err.message, t('mainPage.Error'));
    },
  });

  register('paymentId', { required: true });
  register('paymentType', { required: true });

  const paymentType = watch('paymentType');

  const [validateTransaction, { loading: validating }] = useMutation(VALIDATE_TRANSACTION, {
    onCompleted(data) {
      if (data.validateTransaction.paymentState === 'PAID') {
        setVisiblePending(false);
        reset({
          paymentId: null,
          paymentType: null,
        });
        router.push(`/payment/success?id=${id}`);
      } else if (data.validateTransaction.paymentState !== 'PAID') {
        showAlert(true, 'warning', t('mainPage.NotPaidDescription'), t('mainPage.NotPaid2'));
      }
    },
    onError(err) {
      showAlert(true, 'error', err.message, t('mainPage.Error'));
    },
  });

  const onSubmit = (values: any) => {
    if (paying) return;
    if (CARD_PAYMENTS.includes(paymentType)) return;
    if (paymentType === PAYMENT_TYPE.Cash) return;

    if (!deliveryDateValid()) {
      showNotification(NotificationType.WARNING, 'Хүргэх хугацаа дууссан байна. Захиалгаа дахин засах хэрэгтэй.');
      return;
    }

    let input = {
      buyer: orderStore.buyer,
      confirm: false,
      order: id,
      payment: values.paymentId,
      register: orderStore.register,
      vatType: participant.vat ? orderStore.vatType : 0,
    };

    payOrderByPayment({
      variables: {
        input: { ...input },
      },
    });
  };

  const { loading, data } = useQuery(GET_ORDER, {
    skip: !id,
    variables: { id: id },
    onError(err) {
      showNotification(NotificationType.ERROR, err.message);

      if (participant) {
        let partnerId = localStorage?.getItem('partnerId');
        if (partnerId) {
          router.push(`/partner?id=${partnerId}`);
        }
      }
    },
    onCompleted: (data) => {
      if (data?.getOrder.paymentState === 'PAID') {
      }
    },
  });

  const onSelectBank = (type: any, id: string) => {
    setValue('paymentId', id);
    setValue('paymentType', type);
  };

  const waitPaymentOnClose = () => {
    setVisiblePending(false);
    reset({
      paymentId: null,
      paymentType: null,
    });
  };

  const onRefetch = async (transactionId: string) => {
    try {
      await validateTransaction({
        variables: { id: transactionId },
        onCompleted(data) {
          if (data.validateTransaction.paymentState === 'PAID') {
            setVisiblePending(false);
            router.push(`/payment/success?id=${id}`);
          } else if (data.validateTransaction.paymentState !== 'PAID') {
            showCustomNotification(null, 'Таны төлбөр төлөгдөөгүй байна.', NotificationType.WARNING);
          }
        },
      });
    } catch (error) {
      console.error('Error while refetching:', error);
      showNotification(NotificationType.WARNING, 'Та мэдээллийг дахин татахад алдаа гарлаа.');
    }
  };

  useEffect(() => {
    if (data?.getOrder && data?.getOrder.paymentState === 'PAID') {
      router.push(`/payment/success?id=${id}`);
    }
  }, [data]);

  const goBack = () => {
    if (participant?.vat) {
      router.push(`/vat?id=${id}`);
    } else {
      router.push(`/delivery-type?id=${participant.id}`);
    }
  };

  const goDeliveryType = () => {
    router.push(`/delivery-type?id=${participant.id}&order=${id}`);
  };

  const goUserInfo = () => {
    router.push(`/user-info?id=${participant.id}&order=${id}`);
  };

  const deliveryDateValid = () => {
    const now = moment();

    const rawDate = data?.getOrder?.deliveryDate?.trim();
    if (!rawDate) return false;

    const [startPart] = rawDate.split(' - ');
    const startTime = startPart.trim();

    const deliveryDate = moment(startTime, 'YYYY-MM-DD HH:mm', true);

    if (!deliveryDate.isValid()) {
      return false;
    }

    return now.isBefore(deliveryDate);
  };

  return (
    <section className="flex w-full justify-center">
      <div
        className={`relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5 ${
          loading || paying || validating ? 'opacity-20' : ''
        }`}
      >
        <div className="w-full mt-4 px-4">
          <Step totalSteps={participant?.vat ? 5 : 4} activeStep={participant?.vat ? 4 : 3} />
        </div>
        <div className=" flex gap-4 items-center w-full mt-4 px-6">
          <span className="text-lg text-primary font-semibold">Төлбөр</span>
        </div>

        <form className=" mt-2  h-[85vh] overflow-auto	">
          <div className="mt-2">
            <div className="text-sm font-semibold text-misty text-start mx-8 ">Захиалгын мэдээлэл</div>
          </div>

          <div className="grid bg-white rounded-lg px-6  ">
            <div className="flex w-full justify-between	 bg-gray-100 p-2 rounded-lg mt-4   ">
              <div className="grid grid-cols-8 gap-2 ">
                <div className="col-span-1 flex w-full self-center justify-center  ">
                  <div className="p-2 grid bg-white rounded-full ">
                    <img src={timer.src} alt="logo" className="w-5 h-5 " />
                  </div>
                </div>

                <div className="grid col-span-7">
                  <span className="content-center text-gray-700 text-sm font-bold">
                    {data?.getOrder?.type === 'TakeAway' ? 'Авч явах цаг:' : 'Хүргэх хугацаа:'}{' '}
                  </span>
                  <span className="content-center line-clamp-1 text-sm text-gray-700 font-semibold">
                    {data?.getOrder?.deliveryDate === 'ASAP' ? t('mainPage.ASAP') : data?.getOrder?.deliveryDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center mr-2 ">
                <FiEdit3 className="text-gray-600" onClick={() => goDeliveryType()} />
              </div>
            </div>

            {data?.getOrder?.type === 'Delivery' && (
              <div className="flex w-full justify-between	 bg-gray-100 p-2 rounded-lg mt-4   ">
                <div className="grid grid-cols-8 gap-2 ">
                  <div className="col-span-1 flex w-full self-center justify-center  ">
                    <div className="p-2 grid bg-white rounded-full ">
                      <img src={toLocation.src} alt="logo" className="w-5 h-5 " />
                    </div>
                  </div>

                  <div className="grid col-span-7">
                    <span className="content-center text-gray-700 text-sm font-bold">Хүргүүлэх хаяг: </span>
                    <span className="content-center text-sm line-clamp-1 text-gray-700 font-semibold">
                      {data?.getOrder?.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mr-2 ">
                  <FiEdit3 className="text-gray-600" onClick={() => goUserInfo()} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-misty text-start  mx-8 ">
              {t('mainPage.SelectYourPaymentChannel')}
            </div>
          </div>
          <div className="w-full bg-white rounded-lg p-2 px-6  mb-10 ">
            <div className="grid justify-center gap-2 ">
              <BankFrom
                banks={participant?.payments.filter((payment) => !filterBanks.includes(payment.type))}
                watch={watch}
                onSelect={onSelectBank}
              />
              <QpayForm
                payment={participant?.payments.find((payment) =>
                  [PAYMENT_TYPE.QPay, PAYMENT_TYPE.QPay2].includes(payment.type),
                )}
                watch={watch}
                onSelect={onSelectBank}
              />
            </div>
          </div>
        </form>

        {visiblePending && (
          <WaitPaymentModal
            transaction={transaction}
            visible={visiblePending}
            onClose={() => waitPaymentOnClose()}
            refetch={onRefetch}
          />
        )}

        <div className=" fixed cursor-pointer bottom-0 p-4 sm:bottom-0 transition-all duration-500  md:bottom-5 lg:bottom-5 w-full   sm:w-full md:w-6/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12">
          <div className="w-full flex justify-between text-sm place-items-center">
            <div onClick={() => goBack()} className="flex p-4 rounded-lg bg-gray-300 px-6 ">
              <span className="text-white">Буцах</span>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                loading || isEmpty(paymentType) || !deliveryDateValid()
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              <span>{t('mainPage.Payment')}</span>
              {data?.getOrder?.items.length > 0 && (
                <>
                  <span className="block text-white text-md font-semibold">
                    ( {data?.getOrder?.grandTotal.toLocaleString()} {CURRENCY} )
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
