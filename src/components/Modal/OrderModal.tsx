import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ORDER } from '../../graphql/query';
import { BankName, ConvertBankImg, ConvertOrderType } from '../../tools/convertImg';
import { ItemCard, OrderTypeStepper } from '..';
import { DRAFT_TYPE } from '../../constants/constant';
import { CgSpinner } from 'react-icons/cg';
import { numberFormat } from '../../utils';
import { CURRENCY } from '../../constants/currency';
import { useRouter } from 'next/router';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import { VALIDATE_TRANSACTION } from '../../graphql/mutation/order';
import { useNotificationContext } from '../../providers/notification';
import { useCallStore } from '../../contexts/call.store';
import { customeModalTheme } from '../../../styles/themes';
import moment from 'moment';

export const OrderModal = ({ orderId, orderVisible, onClose }) => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const [transactionId, setTransactionId] = useState<string>('');
  const { showCustomNotification } = useNotificationContext();
  const { participant } = useCallStore();
  const { loading, data, refetch } = useQuery(GET_ORDER, {
    skip: !orderId,
    variables: { id: orderId },
  });

  const [validateTransaction, { loading: validating }] = useMutation(VALIDATE_TRANSACTION, {
    onCompleted(data) {
      setTransactionId(null);
      if (data.validateTransaction.paymentState !== 'PAID') {
        showCustomNotification('Төлөгдөөгүй', 'Таны төлбөр төлөгдөөгүй байна.');
      }
    },
  });

  // Check if the order was created today
  const isOrderFromToday = () => {
    if (!data?.getOrder?.createdAt) return false;
    const orderDate = moment(data.getOrder.createdAt);
    const today = moment();
    return orderDate.isSame(today, 'day');
  };

  const convertState = (state: any) => {
    switch (state) {
      case DRAFT_TYPE.ACCEPTED:
        return 1;
      case DRAFT_TYPE.PREPARING:
        return 2;
      case DRAFT_TYPE.PREPARED:
        return 3;
      case DRAFT_TYPE.DELIVERING:
        return 4;
      case DRAFT_TYPE.PICKEDUP:
        return 5;
      case DRAFT_TYPE.COMPLETED:
        return 6;
    }
  };

  const goPayment = () => {
    onClose();
    router.push(`payment?id=${orderId}`);
  };

  const validTransaction = (id) => {
    setTransactionId(id);
    validateTransaction({ variables: { id: id } });
  };

  return (
    <Modal show={orderVisible} theme={customeModalTheme} onClose={() => onClose()}>
      {data && (
        <>
          <Modal.Header>
            <div className="flex place-content-center gap-4 place-items-center">
              <img src={ConvertOrderType(data.getOrder.type)} className="w-12 h-12" />
              <div>
                <div className="text-sm mt-2  ">{t(`mainPage.${data && data.getOrder?.type}`)}</div>
                {data.getOrder?.number && (
                  <div className="flex gap-1">
                    <div className="text-sm mt-2 text-misty   ">{t('mainPage.OrderNumber')}:</div>
                    <div className="text-sm mt-2 text-current text-center  ">
                      {data && data.getOrder?.number.slice(-4)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal.Header>

          <Modal.Body className="overflow-auto">
            <div className="px-4">
              {data.getOrder?.state !== 'COMPLETED' && (
                <OrderTypeStepper order={data.getOrder} count={convertState(data.getOrder.state)} />
              )}
            </div>
            <div className="text-sm mt-2 font-semibold mb-2 ">{t('mainPage.YourOrder')}</div>
            <div>
              {data.getOrder.items.map((item) => (
                <ItemCard item={item} key={item.id} image={item.image} />
              ))}
            </div>
            <div className="text-sm mt-2  font-semibold mb-2">{t('mainPage.PaymentInformation')}</div>
            <div className="flex justify-between mb-2">
              <div className="text-sm text-misty">{t('mainPage.Discount')}</div>
              <div className="text-sm text-misty">
                {data.getOrder?.discountAmount.toLocaleString()} {CURRENCY}
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <div className="text-sm text-misty">{t('mainPage.Tax')}</div>
              <div className="text-sm text-misty">
                {data.getOrder?.taxAmount.toLocaleString()} {CURRENCY}
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <div className="text-sm  font-semibold">{t('mainPage.Total')}</div>
              <div className="text-sm ">
                {data.getOrder?.grandTotal.toLocaleString()} {CURRENCY}
              </div>
            </div>
            <div>
              {data.getOrder?.transactions.map((transaction) => (
                <div key={transaction.id}>
                  <div className="border-b my-2"></div>
                  <div className="flex justify-between place-items-center ">
                    <div className="flex gap-2">
                      <img src={ConvertBankImg(transaction.type)} alt="bank" className="w-10 h-10  rounded-lg" />
                      <span className="text-sm place-self-center text-misty">{BankName(transaction.type)}</span>
                    </div>
                    <div className="flex gap-2 place-items-center">
                      <div></div>
                      <div className="text-xs">
                        {numberFormat.format(transaction?.amount)} {CURRENCY}
                      </div>

                      <div className="flex gap-2 place-items-center">
                        <span
                          className={`${transaction.state === 'PAID' ? 'text-success' : 'text-yellow-400'} text-xs`}
                        >
                          {transaction.state === 'PAID'
                            ? 'Төлөгдсөн'
                            : transaction.state === 'RETURN'
                            ? 'Буцаагдсан'
                            : transaction.state === 'CANCELLED'
                            ? 'Цуцлагдсан'
                            : 'Төлөгдөөгүй'}
                        </span>

                        <span>
                          {transaction.state === 'PAID' ? (
                            <>
                              <AiOutlineCheckCircle className="text-success w-5 h-5 " />
                            </>
                          ) : (
                            <>
                              <BiRefresh
                                onClick={() => validTransaction(transaction.id)}
                                className={`text-yellow-400 ${
                                  transactionId === transaction.id ? 'animate-spin' : 'animate-none'
                                }  w-5 h-5`}
                              />
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Body>

          {/* Payment button - only show for today's orders and non-paid orders */}
          {data.getOrder?.paymentState !== 'PAID' && isOrderFromToday() && (
            <>
              {participant?.orderable && (
                <>
                  <Modal.Footer className="place-content-center">
                    <div className="grid gap-2 place-items-center w-full">
                      <button
                        onClick={() => goPayment()}
                        type="submit"
                        className="w-full flex place-content-between place-items-center border rounded-lg px-4 py-3 
              bg-current   hover:bg-current  text-white
            duration-300"
                      >
                        {loading && <CgSpinner className="text-lg text-white mr-1 animate-spin" />}
                        <span>{t('mainPage.Payment')}</span>
                        <span
                          className="p-1 rounded-lg text-sm
                bg-coral text-white
                 font-semibold"
                        >
                          {numberFormat.format(data.getOrder.grandTotal)} {CURRENCY}
                        </span>
                      </button>
                    </div>
                  </Modal.Footer>
                </>
              )}
            </>
          )}
        </>
      )}
    </Modal>
  );
};
