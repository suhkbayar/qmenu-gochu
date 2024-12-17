import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customThemeScheduleModal } from '../../../styles/themes';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import pin from '../../assets/user/pin.png';
import locAddress from '../../assets/user/location_addres.svg';
import { useLazyQuery } from '@apollo/client';
import { GET_NEAREST_LOCATIONS } from '../../graphql/query';
import { FiChevronRight } from 'react-icons/fi';
import { GOOGLE_CLOUD_KEY } from '../../constants/api';
import toLocation from '../../assets/delivery/to_location.svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
};

const containerStyle = {
  width: '100%',
  height: '36vh',
};

const fallbackCenter = {
  lat: 47.9024278,
  lng: 106.9386946,
};

const AddLocationModal = ({ visible, onClose, onConfirm }: Props) => {
  const { t } = useTranslation('language');

  const loaderOptions = useMemo(
    () => ({
      googleMapsApiKey: GOOGLE_CLOUD_KEY, // Replace with your actual API key
      id: 'google-map-script',
    }),
    [],
  );

  const { isLoaded, loadError } = useJsApiLoader(loaderOptions);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(fallbackCenter);
  const [isDragging, setIsDragging] = useState(false);
  const [address, setAddress] = useState('');
  const [nearestLocations, setNearestLocations] = useState([]);

  const [getNearestLocations, { loading }] = useLazyQuery(GET_NEAREST_LOCATIONS, {
    onCompleted(data) {
      if (!isEmpty(data?.getNearestLocations)) {
        let locations = data?.getNearestLocations;
        setNearestLocations(locations);
        let address = `${locations[0].address}, ${locations[0].description}`;

        setAddress(address);
      }
    },
  });

  // Fetch user's current location
  useEffect(() => {
    if (!visible) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);

          getNearestLocations({
            variables: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.warn('Error fetching location:', error);
          setCenter(fallbackCenter); // Fallback to predefined center
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      setCenter(fallbackCenter);
    }
  }, [visible]);

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
    setAddress(address);
  };

  if (loadError) {
    console.error('Error loading Google Maps:', loadError.message);
    return <div>Error loading Google Maps. Please check your API key and settings.</div>;
  }

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
          <div className="grid w-full h-[74vh] overflow-auto mb-[103px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={17}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onDragStart={onDragStart}
                onDragEnd={() => {
                  // Ensure marker stays at the final center after drag ends
                  if (map) {
                    const newCenter = map.getCenter();
                    if (newCenter) {
                      const location = { lat: newCenter.lat(), lng: newCenter.lng() };
                      getNearestLocations({
                        variables: {
                          lat: location.lat,
                          lon: location.lng,
                        },
                      });
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
              </GoogleMap>
            ) : (
              <div className="loader" />
            )}

            <div className="flex self-end justify-center">
              {loading ? (
                <div className=" flex h-[29vh] items items-center">
                  <div className="loader" />
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <div className="h-[29vh] overflow-auto">
                    {nearestLocations.map((item, index) => (
                      <div
                        onClick={() => onNearestLocation(item)}
                        key={index}
                        className="flex cursor-pointer hover:bg-gray-50 items-center justify-between p-2 border-b border-gray-200"
                      >
                        <div className="grid grid-cols-8 gap-2 ">
                          <div className="col-span-1 flex w-full self-center justify-center  ">
                            <div className=" flex w-10 h-10 items-center justify-center">
                              <img src={toLocation.src} className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="grid col-span-7">
                            <span className="flex items-center text-sm  line-clamp-2">
                              {item.address}, {item.description}
                            </span>
                          </div>
                        </div>

                        <div className=" flex items-center justify-end">
                          <FiChevronRight className="text-2xl text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>

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
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="absolute bg-white bottom-0 w-full p-0">
          <div className="w-full p-4 flex text-sm place-items-center">
            <button
              onClick={onFinished}
              className={`flex w-full font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                isEmpty(address) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              {t('confirm', 'Баталгаажуулах')}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
