import React, { useState, useEffect, memo } from 'react';
import { calculateOrderItem, CalculateProductPrice, isConfigurable } from '../../tools/calculate';
import { IOrderItem } from '../../types';
import { FiShoppingCart } from 'react-icons/fi';
import { useCallStore } from '../../contexts/call.store';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import fallback from '../../assets/images/noImage.jpg';
import { isEmpty } from 'lodash';
import { imageLoader } from '../../tools/image';
import { OptionCard, VariantCard } from '..';
import { generateUUID } from '../../tools/generate';
import { CURRENCY } from '../../constants/currency';
import { Modal } from 'flowbite-react';
import { customThemeModal } from '../../../styles/themes';

type Props = {
  onClose: () => void;
  product: any;
  visible: boolean;
};

const Index = ({ onClose, product = {}, visible }: Props) => {
  const { addOrderItem, addOrderItemOptional } = useCallStore();
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation('language');
  const [selectedItem, setSelectedItem] = useState<IOrderItem | null>(null);
  const [visibleValues, setVisibleValues] = useState(true);

  useEffect(() => {
    if (visible) {
      const variant = product?.variants?.[0] || {};
      const item: IOrderItem = {
        id: variant.id,
        uuid: generateUUID(),
        productId: product.productId || '',
        name: variant.name || '',
        reason: '',
        state: 'DRAFT',
        quantity: 1,
        options: [],
        price: variant.salePrice || 0,
        discount: 0,
        image: '',
      };
      setSelectedItem(item);
      triggerAnimation();
    } else {
      setSelectedItem(null);
    }
  }, [visible, product]);

  const triggerAnimation = () => {
    setAnimate(true); // Reset animation
    setTimeout(() => setAnimate(false), 1000); // Reapply animation after a delay
  };

  const handleSelectVariant = (variant: any) => {
    setSelectedItem((prev) =>
      prev?.id === variant.id
        ? { ...prev, quantity: prev.quantity + 1 }
        : {
            id: variant.id,
            uuid: generateUUID(),
            productId: product.productId,
            name: variant.name,
            reason: '',
            state: 'DRAFT',
            quantity: 1,
            options: [],
            price: variant.salePrice,
            discount: 0,
            image: '',
          },
    );
  };

  const handleSelectOption = (option: any) => {
    setSelectedItem((prev) => {
      if (!prev) return prev;

      const isOptionSelected = prev.options.some((selectedOption) => selectedOption.id === option.id);

      const updatedOptions = isOptionSelected
        ? prev.options.filter((item) => item.id !== option.id)
        : [...prev.options, option];

      return { ...prev, options: updatedOptions };
    });
  };

  const handleRemove = () => {
    setSelectedItem((prev) => (prev && prev.quantity > 1 ? { ...prev, quantity: prev.quantity - 1 } : prev));
  };

  const handleAddItem = () => {
    if (selectedItem) {
      if (isConfigurable(product)) {
        addOrderItemOptional(selectedItem);
      } else {
        addOrderItem(selectedItem);
      }
    }
    onClose();
  };

  const ImageSection = memo(() => (
    <div className="items-center lg:w-96 flex place-content-center object-cover rounded-md">
      <Image
        src={isEmpty(product.image) ? fallback.src : product.image}
        alt="Product"
        loader={imageLoader}
        width={500}
        height={1}
        placeholder="empty"
        style={{ borderRadius: '10px', width: 'auto', height: 'auto' }}
        priority
      />
    </div>
  ));

  const ProductDetails = memo(() => (
    <>
      <p className=" p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300">
        {product.name}
      </p>
      <span className="block text-gray-500 text-sm">{CalculateProductPrice(product?.variants)}</span>
    </>
  ));

  const VariantsList = memo(() => (
    <div className="flex overflow-x-auto snap-x-mandatory mt-3" style={{ scrollSnapType: 'x mandatory' }}>
      {product.variants?.map((variant) => (
        <VariantCard
          onSelect={handleSelectVariant}
          key={variant.id}
          variant={variant}
          onRemove={handleRemove}
          selectedItem={selectedItem}
        />
      ))}
    </div>
  ));

  return (
    <Modal
      theme={customThemeModal}
      className={`w-full p-0 ${animate ? ' animate__animated animate__fadeIn ' : ' '}`}
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <div>
        <Modal.Header className="bg-current rounded-t-2xl">
          <span className="text-lg text-white">{t('mainPage.ReadMore')}</span>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full overflow-auto">
            <div className="text-center sm:mt-0 sm:ml-4 sm:text-left lg:flex lg:place-content-center">
              <ImageSection />
            </div>
            <div className="flex place-content-between mt-3">
              <ProductDetails />
            </div>
            <div className="text-start text-gray1 mt-3" dangerouslySetInnerHTML={{ __html: product.specification }} />
            <div className="text-start ml-2 mt-3">
              <span>{t('mainPage.Variants')}</span>
            </div>
            <VariantsList />
            <div className="mt-3 lg:grid lg:place-items-center">
              {selectedItem &&
                product.variants
                  ?.find((variant) => variant.id === selectedItem.id)
                  ?.options?.map((option) => (
                    <OptionCard
                      setVisibleValues={setVisibleValues}
                      visibleValues={visibleValues}
                      onSelect={handleSelectOption}
                      isSelected={selectedItem.options.some((selectedOption) => selectedOption.id === option.id)}
                      key={option.id}
                      value={selectedItem.options.find((selectedOption) => selectedOption.id === option.id)?.value}
                      option={option}
                    />
                  ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-between text-sm place-items-center">
            <span className="block text-current font-semibold">
              {selectedItem ? calculateOrderItem(selectedItem).toLocaleString() : 0} {CURRENCY}
            </span>
            <button
              onClick={handleAddItem}
              className="flex font-semibold cursor-pointer place-content-center items-center rounded-lg border border-current h-10 w-32 text-white bg-current text-sm"
            >
              <FiShoppingCart className="text-white mr-2" />
              {t('mainPage.Order')}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Index;
