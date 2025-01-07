import {
  AddLocationModal,
  ControlledInput,
  ControlledLocation,
  ControlledTextArea,
  Loader,
  Step,
} from '../../components';
import { useRouter } from 'next/router';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useCallStore } from '../../contexts/call.store';
import { userSchema } from '../../resolvers';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../../graphql/mutation/order';
import { IOrder } from '../../types';
import { GET_ORDERS } from '../../graphql/query';
import { CURRENCY } from '../../constants/currency';
import { TYPE } from '../../constants/constant';

const fallbackCenter = {
  lat: 47.9024278,
  lng: 106.9386946,
};

const Index = () => {
  const router = useRouter();
  const { id, order: orderId } = router.query;
  const { order, user, participant, load, selectedParticipant } = useCallStore();
  const { t } = useTranslation('language');
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const { control, handleSubmit, setValue, watch } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(userSchema) as any,
  });

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
      load({
        ...order,
        ...{ id: data.createOrder.id, address: data.createOrder.address, comment: data.createOrder.comment },
      });

      if (orderId) {
        router.push(`/payment?id=${data.createOrder.id}`);
      } else {
        if (participant.vat) {
          router.push(`/vat?id=${data.createOrder.id}`);
        } else {
          router.push(`/payment?id=${data.createOrder.id}`);
        }
      }
    },
    onError(err) {},
  });

  const { phone, userName, location } = watch();

  const goBack = () => {
    router.push(`/delivery-type?id=${id}`);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(userLocation);
        },
        (error) => {
          console.warn('Error fetching location:', error);
          setSelectedLocation(fallbackCenter);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      setSelectedLocation(fallbackCenter);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setValue('phone', user.phone);
      setValue('userName', user.firstName);
    }
  }, [user]);

  const onSubmit = (data: FieldValues) => {
    if (order) {
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
            type: order.type,
            items: items,
            deliveryDate: order.deliveryDate,
            contact: data.phone,
            address: data.location,
            name: data.userName,
            comment: data.comment,
            channelId: order.type === TYPE.TAKE_AWAY ?  selectedParticipant?.id : null,
            guests: 1,
          },
        },
      });
    }
  };

  const onLocation = (data: any) => {
    setValue('location', data);
  };

  if (loading) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        {/* Step Indicator */}
        <div className="w-full mt-4 px-4">
          <Step totalSteps={participant?.vat ? 5 : 4} activeStep={2} />
        </div>

        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <span className="text-lg text-primary font-semibold">Хэрэглэгчийн мэдээлэл</span>
        </div>

        <form className="w-full grid gap-4 mt-4 px-4">
          <ControlledInput
            control={control}
            text="Хэрэглэгчийн нэр"
            name="userName"
            disabled
            inputMode="numeric"
            type="text"
          />

          <ControlledInput control={control} disabled text="Хэрэглэгчийн утас" name="phone" type="text" />

          <ControlledTextArea control={control} name="comment" text="Нэмэлт тэмдэглэл" />

          <ControlledLocation
            control={control}
            selectedLocation={selectedLocation}
            text="Хаяг оруулах"
            setValue={setValue}
            name="location"
            type="text"
            showLocatioin={() => setVisibleLocation(true)}
          />
        </form>
        <div className=" fixed cursor-pointer bottom-0 p-4 sm:bottom-0 transition-all duration-500  md:bottom-5 lg:bottom-5 w-full   sm:w-full md:w-6/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12">
          <div className="w-full flex justify-between text-sm place-items-center">
            <div onClick={() => goBack()} className="flex p-4 rounded-lg bg-gray-300 px-6 ">
              <span className="text-white">Буцах</span>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                isEmpty(phone && userName && location) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
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
      <AddLocationModal visible={visibleLocation} onClose={() => setVisibleLocation(false)} onConfirm={onLocation} />
    </section>
  );
};

export default Index;
