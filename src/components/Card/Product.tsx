import React, { useEffect, useState } from 'react';
import { IMenuProduct } from '../../types/menu';
import fallback from '../../assets/images/noImage.jpg';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { imageLoader } from '../../tools/image';
import { Translate } from 'react-auto-translate';
import { CalculateProductsPrice, isConfigurable } from '../../tools/calculate';
import { FiShoppingCart } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MenuItemState } from '../../constants/constant';
import { useCallStore } from '../../contexts/call.store';
import { IOrderItem } from '../../types';
import { FiPlus } from 'react-icons/fi';
import { FiMinus } from 'react-icons/fi';
import { ProductModal } from '..';

type Props = {
  product: IMenuProduct;
  orderItem: IOrderItem;
};

const Index = ({ product, orderItem }: Props) => {
  const { t } = useTranslation('language');
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
      <div key={product.id} className="p-2 ">
        <div className=" hover:shadow-xl  shadow-lg bg-white   rounded-md  rounded-b-2xl ">
          <div className="relative object-cover rounded-md " onClick={() => setVisible(true)}>
            <Image
              src={isEmpty(product.image) ? fallback.src : product.image}
              alt="stew"
              loader={imageLoader}
              width={500}
              height={600}
              placeholder="empty"
              className=" h-[160px] sm:h-[200px]"
              object-fit="cover"
              style={{
                borderRadius: '8px',
                width: '100%', // Ensure fixed width
                objectFit: 'cover', // This ensures the image covers the area without distortion
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
            />
          </div>
          <div className="m-4  mt-0 mb-0">
            <h2
              style={{
                alignContent: 'center',
              }}
              className="line-clamp-2 flex items-center md:text-lg content-center h-9 md:h-12 leading-4 md:leading-tight font-bold   text-sm text-misty"
            >
              <Translate>{product.name} </Translate>
            </h2>
            {/* <span className="line-clamp-2  mb-1 dark:text-gray-400  leading-[15px] h-[31px] text-gray-500 text-sm  ">
              <Translate>{product.description} </Translate>
            </span> */}
            <span className="block text-gray-500 text-sm mb-0 h-7 ">{CalculateProductsPrice(product.variants)}</span>
          </div>
          {isConfigurable(product) ? (
            <div className=" bg-current rounded-b-xl py-2 ">
              <button
                onClick={() => setVisible(true)}
                className="flex font-semibold cursor-pointer place-content-center items-center   w-full text-white  text-sm p-1"
              >
                <FiShoppingCart className="text-white mr-2" />
                {t('mainPage.Enter')}
              </button>
            </div>
          ) : (
            <>
              {orderItem ? (
                <div className="flex items-center  justify-between  sm:justify-around px-2 py-2 pt-0   rounded-b-xl">
                  <div onClick={() => onRemove(product)} className="border-2  rounded-xl px-2 py-1  border-current">
                    <FiMinus className="text-2xl text-current" />
                  </div>
                  <p className={`mx-2 text-lg text-current ${showAnimation ? 'animate-quantity-change' : ''} `}>
                    {orderItem.quantity}
                  </p>
                  <div
                    onClick={() => onSelect(product.productId)}
                    className="border-2  rounded-xl px-2 py-1  border-current"
                  >
                    <FiPlus className="text-2xl text-current" />
                  </div>
                </div>
              ) : (
                <div className=" bg-current rounded-b-xl py-2 ">
                  <button
                    onClick={() => onSelect(product.productId)}
                    className="flex font-semibold cursor-pointer place-content-center items-center   w-full text-white  text-sm p-1"
                  >
                    <FiShoppingCart className="text-white mr-2" />
                    {t('mainPage.Order')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {visible && <ProductModal visible={visible} onClose={() => onCloseProduct()} product={product} />}
    </>
  );
};

export default Index;
