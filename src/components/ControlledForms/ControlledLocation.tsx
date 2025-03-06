import React, { useCallback, useEffect, useState } from 'react';
import { Controller, Control, FieldError, UseFormSetValue, FieldValues } from 'react-hook-form';
import locationPin from '../../assets/user/location.svg';
import { GET_NEAREST_LOCATIONS, SEARCH_LOCATIONS } from '../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight } from 'react-icons/fi';
import { isEmpty } from 'lodash';
import toLocation from '../../assets/delivery/to_location.svg';
import { Alert } from 'flowbite-react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IOrder } from '../../types';

type Props = {
  order: IOrder;
  control: Control<any, any>;
  name: string;
  setValue: UseFormSetValue<FieldValues>;
  selectedLocation?: google.maps.LatLngLiteral | null;
  setSelectedLocation: (location: google.maps.LatLngLiteral | null) => void;

  type: string;
  showLocatioin?: () => void;
  setIsDelivery: (value: boolean) => void;
  placeholder?: string;
  inputMode?: any;
  text?: string;
};

const Index = ({
  order,
  control,
  name,
  setValue,
  selectedLocation,
  text,
  placeholder,
  type,
  setIsDelivery,
  showLocatioin,
  setSelectedLocation,
  inputMode,
}: Props) => {
  const [locations, setLocations] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);

  const [searchLocations, { data, loading }] = useLazyQuery(SEARCH_LOCATIONS, {
    onCompleted(data) {
      setIsRecommended(false);
      setLocations(data?.searchLocations);
    },
  });

  const [getNearestLocations, { loading: nearesting }] = useLazyQuery(GET_NEAREST_LOCATIONS, {
    onCompleted(data) {
      if (!isEmpty(data?.getNearestLocations)) {
        setIsRecommended(true);
        let locations = data?.getNearestLocations;
        setLocations(locations);
      }
    },
  });

  const fetchNearestLocations = useCallback(() => {
    if (selectedLocation) {
      getNearestLocations({
        variables: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lng,
        },
      });
      setIsDelivery(false);
    }
  }, [selectedLocation, getNearestLocations, setIsDelivery]);

  useEffect(() => {
    if (selectedLocation) {
      fetchNearestLocations();
    }
  }, [, selectedLocation, fetchNearestLocations]);

  return (
    <Controller
      control={control}
      name={'searchingLocation'}
      render={({ field: { onChange, ref, value }, formState: { errors } }) => {
        const onSearch = (keyword: string) => {
          if (selectedLocation) {
            searchLocations({ variables: { query: keyword, lat: 0, lon: 0, size: 10 } });
          }
          onChange(keyword);
        };

        const onNearestLocation = (data: any) => {
          let address = `${data.address}, ${data.description}`;
          setValue(name, address);
          onChange(address);
          if (data.lat && data.lon) {
            setSelectedLocation({ lat: data.lat, lng: data.lon });
          }
        };

        return (
          <>
            <div className="space-y-2 w-full">
              {text && <p className="text-sm font-semibold text-gray-800 "> {text}</p>}
              <div className="flex gap-2 ">
                <input
                  onChange={(e) => onSearch(e.target.value)}
                  value={value}
                  ref={ref}
                  inputMode={inputMode}
                  placeholder={placeholder || ''}
                  className=" w-full bg-white placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                  type={type}
                />

                <div
                  className={`p-2 rounded-lg ${
                    !isEmpty(selectedLocation) ? 'bg-current ' : 'bg-gray-300  '
                  }   cursor-pointer`}
                  onClick={() => {
                    showLocatioin();
                  }}
                >
                  <img src={locationPin.src} alt="loc" className="w-8 h-8" />
                </div>
              </div>

              <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors[name] as FieldError)?.message}</p>
              {order?.charges
                ?.filter((c) => c.state === 'A')
                ?.map((item, index) => (
                  <Alert color="warning" className="mt-2" rounded icon={BsFillInfoCircleFill}>
                    <span className="font-medium text-md">
                      Та хүргэлтийн {item.name} д байна. Хүргэлтийн төрбөр {item.amount.toLocaleString()}
                    </span>
                  </Alert>
                ))}

              {!isEmpty(order) && isEmpty(order?.charges?.filter((c) => c.state === 'A')) && (
                <Alert color="warning" className="mt-2" rounded icon={BsFillInfoCircleFill}>
                  <span className="font-medium text-md">Та хүргэлтийн бүсээс гарсан байна</span>
                </Alert>
              )}

              {loading || nearesting ? (
                <div className=" flex h-[29vh] justify-self-center items-center">
                  <div className="loader" />
                </div>
              ) : (
                <div>
                  {isRecommended && (
                    <span>
                      <p className="text-sm font-semibold text-gray-800 ">Тантай ойр</p>
                    </span>
                  )}

                  <div className="flex flex-col w-full">
                    <div className="flex-1 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] pb-4">
                      {locations.map((item, index) => (
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
                </div>
              )}
            </div>
          </>
        );
      }}
    />
  );
};

export default Index;
