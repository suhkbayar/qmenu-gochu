import React, { useEffect, useState } from 'react';
import { IMenuProduct } from '../../types/menu';
import fallback from '../../assets/images/noImage.jpg';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { CalculateProductPrice, isConfigurable } from '../../tools/calculate';
import { useTranslation } from 'react-i18next';
import { MenuItemState } from '../../constants/constant';
import { useCallStore } from '../../contexts/call.store';
import { IOrderItem } from '../../types';
import { ProductModal } from '..';
import { FiPlus } from 'react-icons/fi';
import { FiMinus } from 'react-icons/fi';

type Props = {
  product: IMenuProduct;
  orderItem: IOrderItem;
  isFullWidth?: boolean;
};

const Index = ({ product, orderItem, isFullWidth }: Props) => {
  const { t } = useTranslation('language');
  const { participant } = useCallStore();

  const [visible, setVisible] = useState(false);
  const { add, remove } = useCallStore();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    const timeout = setTimeout(() => {
      setShowAnimation(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [orderItem?.quantity]);

  const onSelect = (productId: string) => {
    if (product?.state !== MenuItemState.ACTIVE) return;
    if (!product || product.variants.length === 0) return;

    if (product.variants.length > 1) {
      setVisible(true);
    } else {
      product.variants.forEach((item) => {
        if (item.options?.length > 0) {
          setVisible(true);
        } else {
          add(product.variants[0], productId);
        }
      });
    }
  };

  const onRemove = (item) => {
    remove(item);
  };

  const onCloseProduct = () => {
    document.body.style.overflow = 'auto';
    setVisible(false);
  };

  return (
    <>
      <div key={product.id} className={` ${isFullWidth ? 'w-full' : 'w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/4'}  p-2 `}>
        <div className="relative hover:shadow-xl shadow-lg bg-white dark:bg-gray-700 rounded-md rounded-t-xl">
          {product.bonus && <div className="ribbon-2">{product.bonus}</div>}
          <div className="relative object-cover rounded-md" onClick={() => setVisible(true)}>
            <Image
              alt="product"
              src={isEmpty(product.image) ? fallback.src : product.image}
              width={500}
              height={200}
              className="rounded-lg object-cover overflow-hidden rounded-tl-xl rounded-bl-xl"
              style={{
                height: '100px',
                maxWidth: '100%',
              }}
            />
          </div>
          <div className="m-2 grid mt-1">
            <h2 className="line-clamp-1 content-center font-normal text-current text-gray-700 text-[15px]">
              {!isEmpty(product.name) && product.name}
            </h2>

            <div className="flex justify-between mb-2">
              <span className="flex justify-start mt-2 text-gray-600 text-sm leading-3">
                {CalculateProductPrice(product.variants)}
              </span>

              {participant?.orderable && (
                <div className="">
                  {orderItem ? (
                    <div className="flex items-center place-content-center">
                      <div className="flex justify-end">
                        <div className="p-[2px] rounded-md border-2 border-current">
                          <FiMinus onClick={() => onRemove(product)} className="cursor-pointer text-gray-600 text-xl" />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <p className={`mx-2 text-gray-700 ${showAnimation ? 'animate-quantity-change' : ''}`}>
                          {orderItem.quantity}
                        </p>
                      </div>
                      <div className="flex justify-start">
                        <div className="p-[2px] rounded-md border-2 border-current">
                          <FiPlus
                            onClick={() => onSelect(product.productId)}
                            className="cursor-pointer text-gray-600 text-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => (!isConfigurable(product) ? onSelect(product.productId) : setVisible(true))}
                      className="flex font-semibold cursor-pointer place-content-center items-center rounded border border-gray-300 w-full text-gray-600 text-sm p-1"
                    >
                      <FiPlus className="text-gray-600 text-lg" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {visible && <ProductModal visible={visible} onClose={() => onCloseProduct()} product={product} />}
    </>
  );
};

export default Index;
