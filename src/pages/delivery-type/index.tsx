import { useRouter } from 'next/router';
import { Loader, Step } from '../../components';
import { useTranslation } from 'react-i18next';
import { useCallStore } from '../../contexts/call.store';
import { CURRENCY } from '../../constants/currency';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../../graphql/mutation/order';
import { IOrder } from '../../types';
import { GET_ORDERS } from '../../graphql/query';
import { TYPE } from '../../constants/constant';

const Index = () => {
  const router = useRouter();
  const { id, order: orderId } = router.query;
  const { t } = useTranslation('language');
  const { order, load, participant, user } = useCallStore();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [item, setItem] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<string>('ASAP');
  const [dates, setDates] = useState<{ label: string; date: string }[]>([]);
  const [times, setTimes] = useState<string[]>([]);

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    update(cache, { data: { createOrder } }) {
      const caches = cache.readQuery<{ getOrders: IOrder[] }>({ query: GET_ORDERS });
      if (caches && caches.getOrders) {
        cache.writeQuery({
          query: GET_ORDERS,
          data: { getOrders: caches.getOrders.concat([createOrder]) },
        });
      }
    },
    onCompleted: (data) => {
      router.push(`/payment?id=${data.createOrder.id}`);
    },
    onError(err) {},
  });

  const navigateToUserInfo = () => {
    let DeliveryDate = '';

    if (!isEmpty(selectedDate)) {
      if (isEmpty(selectedTime)) return;
      if (selectedTime === 'ASAP') {
        DeliveryDate = 'ASAP';
      } else {
        DeliveryDate = `${item.date} ${selectedTime} `;
      }
    } else if (selectedTime === 'ASAP') {
      DeliveryDate = 'ASAP';
    }

    if (orderId) {
      const items = order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        comment: item.comment,
        options: item.options.map((option) => ({
          id: option.id,
          value: option.value,
        })),
      }));

      createOrder({
        variables: {
          participant: id,
          input: {
            type: TYPE.DELIVERY,
            items: items,
            deliveryDate: DeliveryDate,
            contact: user.phone,
            address: order.address,
            name: user.firstName,
            comment: order.comment,
            guests: 1,
          },
        },
      });
    } else {
      router.push(`/user-info?id=${id}`);
    }

    load({ ...order, deliveryDate: DeliveryDate });
  };

  useEffect(() => {
    const generateDates = () => {
      const newDates = [];
      const today = new Date();
      for (let i = 0; i < 2; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        const label =
          i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : futureDate.toLocaleDateString('en-US', { weekday: 'short' });
        let date = moment(futureDate).format('YYYY-MM-DD');
        newDates.push({ label, date });
      }
      setDates(newDates);
    };

    generateDates();
  }, []);

  // Generate times based on the selected date
  useEffect(() => {
    const generateTimes = () => {
      const newTimes = [];
      const now = new Date();

      if (selectedDate === 'Today') {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (let hour = currentHour; hour < 23; hour++) {
          for (let minute = hour === currentHour ? (currentMinute > 30 ? 30 : 0) : 0; minute < 60; minute += 30) {
            const startTime = new Date();
            startTime.setHours(hour, minute, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + 30);

            newTimes.push(
              `${startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            );
          }
        }
      } else {
        // For other dates, start from 8:00 AM with 30-minute intervals
        for (let hour = 8; hour < 23; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const startTime = new Date();
            startTime.setHours(hour, minute, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + 30);

            newTimes.push(
              `${startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            );
          }
        }
      }
      setTimes(newTimes);
    };

    generateTimes();
  }, [selectedDate]);

  const goBack = () => {
    router.push(`/branch?id=${id}`);
  };

  const onSelectDate = (item: any) => {
    setSelectedDate(item.label);
    setItem(item);
    setSelectedTime('');
  };

  const onSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  if (loading) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        {/* Step Indicator */}
        <div className="w-full mt-4 px-4">
          <Step totalSteps={participant?.vat ? 5 : 4} activeStep={1} />
        </div>

        {/* Section Title */}
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <span className="text-lg text-primary font-semibold">Хүргэх сонголтууд</span>
        </div>

        {/* Delivery Options */}
        <div className="w-full grid gap-4 mt-2 px-4">
          <div className="flex space-x-2 overflow-x-auto mb-4">
            {dates.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectDate(item)}
                className={`px-4 py-2 w-full rounded-lg ${
                  selectedDate === item.label ? 'bg-current text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-sm w-full font-semibold">{t(`mainPage.${item.label}`)}</div>
              </button>
            ))}
          </div>
          <div className="w-full h-[64vh] overflow-auto ">
            <div className=" grid grid-cols-2  gap-2">
              {!isEmpty(selectedDate) && (
                <>
                  {times.map((time) => (
                    <div
                      key={time}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        selectedTime === time ? 'border-current bg-gray-100' : 'border-gray-300'
                      }`}
                      onClick={() => onSelectTime(time)}
                    >
                      <span className="flex-1 text-sm">{time}</span>
                      <input
                        type="radio"
                        checked={selectedTime === time}
                        onChange={() => onSelectTime(time)}
                        className="form-radio text-current "
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bg-white bottom-0 w-full border-t border-gray-100 p-4">
          {(selectedDate === 'Today' || selectedDate === '') && (
            <div
              key="asap"
              className={`flex items-center p-3 border rounded-lg cursor-pointer mb-4 ${
                selectedTime === 'ASAP' ? 'border-current bg-gray-100' : 'border-gray-300'
              }`}
              onClick={() => onSelectTime('ASAP')}
            >
              <span className="flex-1 text-sm">Яаралтай</span>
              <input
                type="radio"
                name="time-selection"
                checked={selectedTime === 'ASAP'}
                onChange={() => onSelectTime('ASAP')}
                className="form-radio text-current"
              />
            </div>
          )}
          <div className="w-full flex justify-between text-sm place-items-center">
            <div
              onClick={() => goBack()}
              className="flex p-4 rounded-lg bg-gray-300 px-6
             "
            >
              <span className="text-white">Буцах</span>
            </div>
            <button
              onClick={navigateToUserInfo}
              className={`flex gap-4 font-semibold cursor-pointer place-content-center items-center rounded-lg px-4 py-4 text-sm ${
                !isEmpty(selectedDate && selectedTime)
                  ? 'bg-current text-white'
                  : `${selectedTime === 'ASAP' ? 'bg-current text-white' : 'bg-gray-300 text-gray-500'} `
              }`}
            >
              <span>{t('mainPage.ToBeContinued')}</span>
              {order?.items.length > 0 && (
                <>
                  <span className="block text-white text-md font-semibold">
                    ( {order?.totalAmount.toLocaleString()} {CURRENCY} )
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
