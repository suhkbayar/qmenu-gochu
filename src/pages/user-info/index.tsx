import { AddLocationModal, ControlledLocation, Loader, Step } from '../../components';
import { useRouter } from 'next/router';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useCallStore } from '../../contexts/call.store';
import { userSchema } from '../../resolvers';
import { useMutation } from '@apollo/client';
import { CALCULATE_DELIVERY_ZONE } from '../../graphql/mutation/order';
import { IOrder } from '../../types';
import { CURRENCY } from '../../constants/currency';
import { TYPE } from '../../constants/constant';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import LocationModal from '../../components/Modal/LocationModal';
import { fallbackCenter } from '../../tools/mapBounds';

const Index = () => {
  const router = useRouter();
  const { id, order: orderId, createOrderId } = router.query;
  const { order, user, participant, load } = useCallStore();
  const { t } = useTranslation('language');
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const { control, handleSubmit, setValue, watch, setError, clearErrors } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(userSchema(order)) as any,
  });

  const [permissionGranted, setPermissionGranted] = useState(false);
  const { location: currentLocation, error, loading, retry } = useCurrentLocation(permissionGranted);

  const [isDelivery, setIsDelivery] = useState(false);

  const [isFallBack, setIsFallBack] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showFallbackMap, setShowFallbackMap] = useState(false);

  const [calculateDeliveryZone, { loading: calculating }] = useMutation(CALCULATE_DELIVERY_ZONE, {
    onCompleted: (data) => {
      setSelectedOrder(data.calculateDeliveryZone);
      load({ ...order, grandTotal: data.calculateDeliveryZone?.grandTotal });
    },
  });

  const { phone, userName, location } = watch();

  const goBack = () => {
    router.push(`/delivery-type?id=${id}`);
  };

  useEffect(() => {
    if (currentLocation) {
      setSelectedLocation({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
  }, [currentLocation]);

  const goMap = () => {
    setSelectedLocation({ lat: fallbackCenter.lat, lng: fallbackCenter.lng });
    setVisibleLocation(true);
    setIsFallBack(true);
  };

  useEffect(() => {
    if (!visibleLocation && selectedLocation?.lat && selectedLocation?.lng) {
      let input = {
        address: location,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };

      let targetId = createOrderId ?? orderId;

      if (targetId) {
        calculateDeliveryZone({
          variables: {
            id: targetId,
            input: input,
          },
        });
      }
    }
  }, [createOrderId, selectedLocation, visibleLocation, location]);

  useEffect(() => {
    if (user) {
      setValue('phone', user.phone);
      setValue('userName', user.firstName);
    }
  }, [user]);

  const onSubmit = (data: FieldValues) => {
    load({
      ...order,
      ...{ id: createOrderId, address: order.type === TYPE.TAKE_AWAY ? null : data.location },
    });

    if (!isEmpty(selectedOrder)) {
      let charges = selectedOrder?.charges?.filter((c) => c.state === 'A');

      if (isEmpty(charges) && order.type === TYPE.DELIVERY) {
        setError('location', {
          type: 'manual',
          message: 'Та газрын зурагаас хаягаа сонгоно уу.',
        });

        setShowFallbackMap(true);
      } else {
        setShowFallbackMap(false);
        if (orderId) {
          router.push(`/payment?id=${orderId}`);
        } else {
          const targetRoute = participant.vat ? `/vat?id=${createOrderId}` : `/payment?id=${createOrderId}`;

          if (order.type === TYPE.TAKE_AWAY) {
            router.push(targetRoute);
          } else if (!isEmpty(selectedOrder?.charges?.filter((c) => c.state === 'A'))) {
            router.push(targetRoute);
          }
        }
      }
    }
  };

  const onLocation = (data: any) => {
    setValue('location', data);
    setValue('searchingLocation', data);
  };

  if (calculating || loading) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="w-full mt-4 px-4">
          <Step totalSteps={participant?.vat ? 5 : 4} activeStep={2} />
        </div>

        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <span className="text-lg text-primary font-semibold">Хаягийн мэдээлэл</span>
        </div>

        <form className="w-full grid gap-4 mt-4 px-4">
          {isEmpty(selectedLocation) ? (
            <div className="grid w-full">
              <p style={{ color: 'red' }}>Error: {error?.message}</p>
              <span className="p-4 text-center  text-white rounded-lg bg-red-500 " onClick={goMap}>
                Газрийн зургаас оруулах
              </span>
            </div>
          ) : (
            <>
              {order?.type === TYPE.DELIVERY && (
                <ControlledLocation
                  order={selectedOrder}
                  setSelectedLocation={setSelectedLocation}
                  setIsDelivery={setIsDelivery}
                  control={control}
                  selectedLocation={selectedLocation}
                  text="Хаяг оруулах"
                  setValue={setValue}
                  name="location"
                  showFallbackMap={showFallbackMap}
                  goMap={goMap}
                  placeholder="Хаяг хайх"
                  type="text"
                  showLocatioin={() => {
                    setIsFallBack(true);
                    setVisibleLocation(true);
                  }}
                />
              )}
            </>
          )}

          {!permissionGranted && (
            <LocationModal onAllow={() => setPermissionGranted(true)} onDeny={() => setPermissionGranted(false)} />
          )}
        </form>

        <div className=" fixed cursor-pointer bottom-0 p-4 sm:bottom-0 transition-all duration-500  md:bottom-5 lg:bottom-5 w-full   sm:w-full md:w-6/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12">
          <div className="w-full flex justify-between text-sm place-items-center">
            <div onClick={() => goBack()} className="flex p-4 rounded-lg bg-gray-300 px-6 ">
              <span className="text-white">Буцах</span>
            </div>

            {order?.type === TYPE.TAKE_AWAY ? (
              <button
                onClick={handleSubmit(onSubmit)}
                className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                  isEmpty(phone && userName) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
                } px-4 py-4 text-sm`}
              >
                <span>{t('mainPage.ToBeContinued')}</span>
                {order?.items.length > 0 && (
                  <>
                    <span className="block text-white text-md font-semibold">
                      ( {selectedOrder?.grandTotal.toLocaleString()} {CURRENCY} )
                    </span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                  isEmpty(location) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
                } px-4 py-4 text-sm`}
              >
                <span>{t('mainPage.ToBeContinued')}</span>
                {order?.items.length > 0 && (
                  <>
                    <span className="block text-white text-md font-semibold">
                      ( {selectedOrder?.grandTotal.toLocaleString()} {CURRENCY} )
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {selectedLocation?.lat && (
        <AddLocationModal
          setSelectedLocation={setSelectedLocation}
          setSelectedOrder={setSelectedOrder}
          isFallBack={isFallBack}
          setIsFallBack={setIsFallBack}
          order={selectedOrder}
          showFallbackMap={showFallbackMap}
          orderId={createOrderId || orderId}
          setValue={setValue}
          clearErrors={clearErrors}
          setShowFallbackMap={setShowFallbackMap}
          name="location"
          currentLoaction={selectedLocation}
          orderLocation={location}
          visible={visibleLocation}
          onClose={() => setVisibleLocation(false)}
          onConfirm={onLocation}
        />
      )}
    </section>
  );
};

export default Index;
