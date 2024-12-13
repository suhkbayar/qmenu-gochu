import React, { useState } from 'react';
import { Controller, Control, FieldError, UseFormSetValue, FieldValues } from 'react-hook-form';
import location from '../../assets/user/location.svg';
import { SEARCH_LOCATIONS } from '../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight } from 'react-icons/fi';

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
  const [searchLocations, { data, loading }] = useLazyQuery(SEARCH_LOCATIONS, {
    onCompleted(data) {
      setLocations(data?.searchLocations);
    },
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ref, value }, formState: { errors } }) => {
        const onSearch = (keyword: string) => {
          if (selectedLocation) {
            searchLocations({ variables: { keyword, lat: 0, lon: 0, size: 10 } });
          }
          onChange(keyword);
        };

        const onNearestLocation = (data: any) => {
          let address = `${data.address}, ${data.description}`;
          setValue(name, address);
          onChange(address);
          setLocations([]);
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

              {loading ? (
                <div className=" flex h-[29vh] justify-self-center items-center">
                  <div className="loader" />
                </div>
              ) : (
                <div className="h-[29vh] overflow-auto">
                  {locations.map((item, index) => (
                    <div
                      onClick={() => onNearestLocation(item)}
                      key={index}
                      className="flex cursor-pointer hover:bg-gray-50 items-center justify-between p-2 border-b border-gray-200"
                    >
                      <div className="flex items-center">
                        {item.address}, {item.description}
                      </div>
                      <div className=" flex items-center justify-end w-10 h-10">
                        <FiChevronRight className="text-2xl text-gray-500" />
                      </div>
                    </div>
                  ))}
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
