import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';

type Props = {
  control: Control<any, any>;
  name: string;
  text?: string;
  placeholder?: string;
};

const Index = ({ control, name, text, placeholder }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref }, formState: { errors } }) => {
        return (
          <div className="space-y-2">
            {text && <p className="text-sm font-semibold text-gray-800 "> {text}</p>}
            <textarea
              onChange={onChange}
              value={value}
              ref={ref}
              placeholder={placeholder || ''}
              className=" w-full placeholder:text-sm px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors[name] as FieldError)?.message}</p>
          </div>
        );
      }}
    />
  );
};

export default Index;
