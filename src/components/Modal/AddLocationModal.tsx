import { Alert, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customThemeScheduleModal } from '../../../styles/themes';
import { GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { isEmpty } from 'lodash';
import pin from '../../assets/user/pin.png';
import locAddress from '../../assets/user/location_addres.svg';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_NEAREST_LOCATIONS, GET_ORDER_ZONES } from '../../graphql/query';
import { FiChevronRight } from 'react-icons/fi';
import { GOOGLE_CLOUD_KEY } from '../../constants/api';
import toLocation from '../../assets/delivery/to_location.svg';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { CALCULATE_DELIVERY_ZONE } from '../../graphql/mutation/order';
import { IOrder } from '../../types';
import { FieldValues, UseFormSetValue } from 'react-hook-form';

type Props = {
  order: IOrder;
  name: string;
  isFallBack: boolean;
  setIsFallBack: (isFallBack: boolean) => void;
  currentLoaction: google.maps.LatLngLiteral;
  orderLocation: any;
  setValue: UseFormSetValue<FieldValues>;
  orderId: any;
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  setSelectedOrder: (order: IOrder) => void;
  setSelectedLocation: (location: google.maps.LatLngLiteral | null) => void;
};

const containerStyle = {
  width: '100%',
  height: '24vh',
};

const AddLocationModal = ({
  name,
  setValue,
  orderId,
  visible,
  onClose,
  onConfirm,
  currentLoaction,
  setSelectedOrder,
  isFallBack,
  setIsFallBack,
  order,
  setSelectedLocation,
  orderLocation,
}: Props) => {
  const { t } = useTranslation('language');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [address, setAddress] = useState('');
  const [nearestLocations, setNearestLocations] = useState([]);
  const [isDelivery, setIsDelivery] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_CLOUD_KEY,
    libraries: ['geometry', 'drawing'],
  });

  const [getOrderZones, { loading: orderZoneLoading }] = useLazyQuery(GET_ORDER_ZONES, {
    onCompleted(data) {
      setPolygons(data?.getOrderZones);
    },
  });

  const [calculateDeliveryZone, { loading: calculating }] = useMutation(CALCULATE_DELIVERY_ZONE, {
    onCompleted: (data) => {
      setSelectedOrder(data.calculateDeliveryZone);
    },
  });

  const [getNearestLocations, { loading }] = useLazyQuery(GET_NEAREST_LOCATIONS, {
    onCompleted(data) {
      if (!isEmpty(data?.getNearestLocations)) {
        let locations = data?.getNearestLocations;
        setNearestLocations(locations);
        let address = `${locations[0].address}, ${locations[0].description}`;
        setAddress(address);
        setValue(name, address);
      }
    },
  });

  useEffect(() => {
    if (orderId) {
      getOrderZones({
        variables: {
          id: orderId,
        },
      });
    }
  }, [orderId]);

  useEffect(() => {
    if (currentLoaction) {
      setCenter(currentLoaction);
    }
  }, [currentLoaction]);

  useEffect(() => {
    if (isFallBack && center) {
      getNearestLocations({
        variables: {
          lat: center.lat,
          lon: center.lng,
        },
      });

      let input = {
        address: 'ҮЦХүрээлэнгийн  хойно',
        lat: center.lat,
        lng: center.lng,
      };

      calculateDeliveryZone({
        variables: {
          id: orderId,
          input: input,
        },
      });
      setIsFallBack(false);
      setIsDelivery(false);
    }
  }, [isFallBack, center]);

  // useEffect(() => {
  //   if (!visible) return;
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const userLocation = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         setCenter(userLocation);
  //         getNearestLocations({
  //           variables: {
  //             lat: position.coords.latitude,
  //             lon: position.coords.longitude,
  //           },
  //         });
  //         setIsDelivery(false);
  //       },
  //       (error) => {
  //         console.warn('Error fetching location:', error);
  //         // setCenter(fallbackCenter); // Fallback to predefined center
  //       },
  //       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
  //     );
  //   } else {
  //     console.warn('Geolocation is not supported by this browser.');
  //     // setCenter(fallbackCenter);
  //   }
  // }, [visible]);

  const onLoad = (mapInstance: google.maps.Map) => {
    mapInstance.setCenter(center); // Set map center to user's location
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const onFinished = () => {
    onConfirm(address);
    onClose();
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onNearestLocation = (location: any) => {
    let address = `${location.address}, ${location.description}`;
    setValue(name, address);
    setAddress(address);

    if (location.lat && location.lon) {
      let input = {
        address: address,
        lat: location.lat,
        lng: location.lon,
      };

      const userLocation = {
        lat: location.lat,
        lng: location.lon,
      };

      setSelectedLocation(userLocation);

      calculateDeliveryZone({
        variables: {
          id: orderId,
          input: input,
        },
      });
    }
  };

  if (!isLoaded)
    return (
      <div className=" flex h-[29vh] justify-center items items-center">
        <div className="loader" />
      </div>
    );

  return (
    <Modal
      theme={customThemeScheduleModal}
      className="w-full p-0"
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <div>
        <Modal.Header className="bg-current">
          <span className="text-lg text-white">Захиалах байршил</span>
        </Modal.Header>
        <Modal.Body>
          <div className="grid w-full h-full overflow-auto ">
            {isLoaded || orderZoneLoading ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={17}
                onLoad={onLoad}
                center={center}
                onUnmount={onUnmount}
                onDragStart={onDragStart}
                onDragEnd={() => {
                  // Ensure marker stays at the final center after drag ends
                  if (map) {
                    const newCenter = map.getCenter();
                    if (newCenter) {
                      const locationCoords = { lat: newCenter.lat(), lng: newCenter.lng() }; // Renamed from 'location'
                      getNearestLocations({
                        variables: {
                          lat: locationCoords.lat,
                          lon: locationCoords.lng,
                        },
                      });

                      let input = {
                        address: orderLocation,
                        lat: locationCoords.lat,
                        lng: locationCoords.lng,
                      };
                      const userLocation = {
                        lat: locationCoords.lat,
                        lng: locationCoords.lng,
                      };

                      setSelectedLocation(userLocation);
                      calculateDeliveryZone({
                        variables: {
                          id: orderId,
                          input: input,
                        },
                      });
                      setIsDelivery(false);
                    }
                  }
                  setIsDragging(false);
                }}
                options={{
                  disableDefaultUI: true, // Disable default UI
                  zoomControl: false, // Disable zoom control
                  gestureHandling: 'greedy', // Handle gestures manually
                  disableDoubleClickZoom: true, // Disable double-click zoom
                }}
              >
                <div
                  className={`custom-marker `}
                  style={{
                    position: 'absolute',
                    transform: `translate(-50%, ${isDragging ? '-120%' : '-100%'})`,
                    top: '50%',
                    left: '50%',
                  }}
                >
                  <img src={pin.src} alt="Marker" style={{ width: 40, height: 40 }} />
                </div>

                {visible && (
                  <>
                    {polygons.map((polygon, index) => {
                      const getRandomRoyalColor = () => {
                        const royalColors = ['#4169E1', '#FFD700', '#8A2BE2', '#4B0082', '#483D8B', '#6A5ACD'];
                        return royalColors[index] ?? '#FFD700';
                      };
                      const strokeColor = getRandomRoyalColor();
                      return (
                        <Polygon
                          paths={polygon.polygons}
                          options={{
                            fillColor: 'transparent',
                            fillOpacity: 0.4,
                            strokeColor: strokeColor,
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                          }}
                          onClick={() => console.log('Polygon clicked!')}
                        />
                      );
                    })}
                  </>
                )}
              </GoogleMap>
            ) : (
              <div className=" flex h-[29vh] justify-center items items-center">
                <div className="loader" />
              </div>
            )}

            {isEmpty(order?.charges?.filter((c) => c.state === 'A')) && (
              <Alert color="warning" className="mt-2" rounded icon={BsFillInfoCircleFill}>
                <span className="font-medium text-md">Та хүргэлтийн бүсээс гарсан байна</span>
              </Alert>
            )}

            {order?.charges
              ?.filter((c) => c.state === 'A')
              ?.map((item, index) => (
                <Alert color="warning" className="mt-2" rounded icon={BsFillInfoCircleFill}>
                  <span className="font-medium text-md">
                    Та хүргэлтийн {item.name} д байна. Хүргэлтийн төрбөр {item.amount.toLocaleString()}
                  </span>
                </Alert>
              ))}
            <div className="flex self-end justify-center">
              {loading || orderZoneLoading || calculating ? (
                <div className=" flex h-[29vh] items items-center">
                  <div className="loader" />
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <div className="flex-1 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] pb-4">
                    {nearestLocations.map((item, index) => (
                      <div
                        onClick={() => onNearestLocation(item)}
                        key={index}
                        className="flex cursor-pointer hover:bg-gray-50 items-center justify-between p-3 border-b border-gray-200"
                      >
                        <div className="grid grid-cols-8 gap-2 w-full">
                          <div className="col-span-1 flex w-full self-center justify-center">
                            <div className="flex w-10 h-10 items-center justify-center">
                              <img src={toLocation.src} className="w-6 h-6" alt="Location" />
                            </div>
                          </div>
                          <div className="grid col-span-5">
                            <span className="flex items-center text-sm text-gray-800 line-clamp-2">
                              {item.address},
                            </span>
                            <span className="flex items-center text-xs text-gray-500 line-clamp-2">
                              {item.description}
                            </span>
                          </div>
                          <div className="grid col-span-2">
                            <div className="flex items-center justify-end">
                              <FiChevronRight className="text-2xl text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="fixed grid bg-white bottom-0 w-full p-0">
          <div className="grid w-full gap-4 p-4">
            <p className="text-sm font-semibold text-gray-800 ">Хүргүүлэх хаяг</p>
            <div className="relative">
              <img src={locAddress.src} className="w-8 h-8 absolute  top-[7px] left-[7px]  " />
              <input
                value={address}
                placeholder={''}
                disabled
                className="h-12 w-full  bg-white placeholder:text-sm px-10 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                type={'text'}
              />
            </div>
            <div className="w-full ">
              <button
                onClick={onFinished}
                className={`flex w-full font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                  isEmpty(address) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
                } px-4 py-4 text-sm`}
              >
                {t('confirm', 'Баталгаажуулах')}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
