import React, { useEffect, useState } from 'react';
import { CURRENCY } from '../../constants/currency';
import { isEmpty } from 'lodash';
import useSound from 'use-sound';
import { SOUND_LINK } from '../../constants/constant';
import { OptionValuesModal } from '..';

type Props = {
  option: any;
  selectedOption: any;
  validateOptions: any[];
  onSelect: (option: any) => void;
  value: string;
  isSelected: boolean;
  visibleValues: boolean;
  selectOption: (option: any) => void;
  setVisibleValues: (visibleValues: boolean) => void;
};

const Index = ({
  option,
  onSelect,
  selectedOption,
  validateOptions,
  isSelected,
  value,
  setVisibleValues,
  selectOption,
  visibleValues,
}: Props) => {
  const [play] = useSound(SOUND_LINK, {
    volume: 1,
  });

  const onSelectOption = (option: any) => {
    play();
    if (!isEmpty(option.values) && isEmpty(value)) {
      selectOption(option);
      setVisibleValues(true);
      return;
    }
    onSelect(option);
  };

  const onSelectValue = (value: any) => {
    if (!selectedOption) {
      return;
    }

    setVisibleValues(false);

    onSelect({ ...selectedOption, value: value });
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectOption(option);
        }}
        className={` flex-shrink-0 grid max-w-full button-variant  content-between  rounded-lg  p-2 px-8 m-2 dark:bg-gray-800 ${
          isSelected
            ? 'bg-macDonald'
            : validateOptions.some((opt) => opt.id === option.id)
            ? ' border border-red-500 bg-gray-200  '
            : 'bg-gray-200   '
        }`}
      >
        <div className="flex">
          <span className="line-clamp-2  font-semibold text-misty text-lg">{option.name}</span>
        </div>
        <span className="text-white text-md">{!isEmpty(value) ? value : !isEmpty(option.values) ? 'Сонгох ' : ''}</span>
        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-macDonald'} text-md`}>
          {option.price.toLocaleString()} {CURRENCY}
        </span>
      </div>
      {visibleValues && option.values && (
        <OptionValuesModal
          visible={visibleValues}
          values={option.values}
          onSelectValue={onSelectValue}
          onClose={() => setVisibleValues(false)}
        />
      )}
    </>
  );
};

export default Index;
