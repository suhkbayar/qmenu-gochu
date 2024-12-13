import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';

type Props = {
  control: Control<any, any>;
  name: string;
  type: string;
  placeholder?: string;
  inputMode?: any;
  text?: string;
  disabled?: boolean;
};

const Index = ({ control, name, text, placeholder, type, inputMode, disabled = false }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref }, formState: { errors } }) => {
        return (
          <>
            <div className="space-y-2 w-full">
              {text && <p className="text-sm font-semibold text-gray-800 "> {text}</p>}
              <input
                onChange={onChange}
                value={value}
                ref={ref}
                readOnly={disabled}
                inputMode={inputMode}
                placeholder={placeholder || ''}
                className={`w-full  ${
                  disabled ? 'bg-gray-100' : 'bg-white'
                }  placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300`}
                type={type}
              />
              <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors[name] as FieldError)?.message}</p>
            </div>
          </>
        );
      }}
    />
  );
};

export default Index;
