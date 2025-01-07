import React, { useEffect, useState } from 'react';
import { Controller, Control, FieldError, UseFormSetValue, FieldValues } from 'react-hook-form';
import location from '../../assets/user/location.svg';
import { GET_NEAREST_LOCATIONS, SEARCH_LOCATIONS } from '../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight } from 'react-icons/fi';
import { isEmpty } from 'lodash';
import toLocation from '../../assets/delivery/to_location.svg';
type Props = {
  control: Control<any, any>;
  name: string;
  setValue: UseFormSetValue<FieldValues>;
  selectedLocation?: google.maps.LatLngLiteral | null;
  type: string;
  showLocatioin?: () => void;
  placeholder?: string;
  inputMode?: any;
  text?: string;
};

const Index = ({
  control,
  name,
  setValue,
  selectedLocation,
  text,
  placeholder,
  type,
  showLocatioin,
  inputMode,
}: Props) => {
  const [locations, setLocations] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
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

  useEffect(() => {
    if (isEmpty(searchKeyword) && selectedLocation) {
      getNearestLocations({
        variables: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lng,
        },
      });
    }
  }, [searchKeyword, selectedLocation]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ref, value }, formState: { errors } }) => {
        const onSearch = (keyword: string) => {
          if (selectedLocation) {
            searchLocations({ variables: { keyword, lat: 0, lon: 0, size: 10 } });
          }
          setSearchKeyword(keyword);
          onChange(keyword);
        };

        const onNearestLocation = (data: any) => {
          let address = `${data.address}, ${data.description}`;
          setValue(name, address);
          onChange(address);
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
                <div className="p-2 rounded-lg bg-current cursor-pointer " onClick={showLocatioin}>
                  <img src={location.src} alt="loc" className="w-8 h-8" />
                </div>
              </div>

              <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors[name] as FieldError)?.message}</p>

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
                  <div className="h-[20vh] overflow-auto">
                    {locations.map((item, index) => (
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
