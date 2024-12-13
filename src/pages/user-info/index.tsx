import { IoArrowBack } from 'react-icons/io5';
import { AddLocationModal, ControlledInput, ControlledLocation, ControlledTextArea, Step } from '../../components';
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

const fallbackCenter = {
  lat: 47.9024278,
  lng: 106.9386946,
};

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { order, user } = useCallStore();
  const { t } = useTranslation('language');
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const { control, handleSubmit, setValue, watch } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      phone: user?.phone,
      userName: user?.firstName,
    },
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
      router.push(`/payment?id=${data.createOrder.id}`);
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

      const emptyObject = {
        deliveryDate: '',
        contact: '',
        address: '',
        name: '',
        comment: '',
        guests: 1,
      };

      // createOrder({
      //   variables: {
      //     participant: id,
      //     input: {
      //       type: TYPE.DELIVERY,
      //       items: items,
      //       deliveryDate: order.deliveryDate,
      //       contact: data.phone,
      //       address: data.location,
      //       name: data.userName,
      //       comment: data.comment,
      //     },
      //   },
      // });
    }
  };

  const onLocation = (data: any) => {
    setValue('location', data);
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        {/* Step Indicator */}
        <div className="w-full mt-4 px-4">
          <Step totalSteps={4} activeStep={2} />
        </div>

        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
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
        <div className="absolute bg-white bottom-0 w-full border-t border-gray-100 p-4">
          <div className="w-full flex justify-between text-sm place-items-center">
            <div className="flex gap-4"></div>
            <button
              onClick={handleSubmit(onSubmit)}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                isEmpty(phone && userName && location) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              {t('mainPage.ToBeContinued')}
            </button>
          </div>
        </div>
      </div>
      <AddLocationModal visible={visibleLocation} onClose={() => setVisibleLocation(false)} onConfirm={onLocation} />
    </section>
  );
};

export default Index;
