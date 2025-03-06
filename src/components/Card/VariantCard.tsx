import React from 'react';
import { IMenuVariant } from '../../types/menu';
import { CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import { IOrderItem } from '../../types';
import check from '../../assets/order/Check.png';
import unCheck from '../../assets/order/UnCheck.png';
import { CURRENCY } from '../../constants/currency';
import { Translate } from 'react-auto-translate';
import { isEmpty } from 'lodash';

type Props = {
  variant: IMenuVariant;
  selectedItem: IOrderItem;
  onSelect: (variant: IMenuVariant) => void;
  onRemove: (variant: IMenuVariant) => void;
};

const Index = ({ variant, selectedItem, onSelect, onRemove }: Props) => {
  if (!selectedItem) return;

  return (
    <>
      <div
        onClick={() => selectedItem.id !== variant.id && onSelect(variant)}
        className={`flex-shrink-0 grid  content-between w-36 h-32 bg-white rounded-lg hover:shadow-md border hover:border-current m-2 p-2 pb-0 ${
          selectedItem?.id === variant.id ? 'border-current' : ''
        }`}
      >
        <div className="flex justify-between">
          <h2 className="line-clamp-2  font-semibold text-current text-sm ">
            {!isEmpty(variant.name) && <Translate>{variant.name}</Translate>}
          </h2>

          {/* {selectedItem.id === variant.id && (
            <img
              alt="check-variant"
              src={check.src}
              className="animate-quantity-change"
              width={20}
              style={{ height: 19 }}
            />
          )} */}
        </div>

        <span className="text-misty font-normal text-sm">
          {variant.price.toLocaleString()} {CURRENCY}
        </span>

        <div className="flex items-center place-content-between justify-center py-1">
          {selectedItem.id === variant.id ? (
            <div className="flex items-center place-content-end">
              <CiSquareMinus onClick={() => onRemove(variant)} className="cursor-pointer text-current w-10 h-10" />
              <p className="mx-2 text-current animate-quantity-change">{selectedItem.quantity}</p>
              <CiSquarePlus onClick={() => onSelect(variant)} className="cursor-pointer text-current w-10 h-10" />
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
