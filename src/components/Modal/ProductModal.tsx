import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import { calculateOrderItem, CalculateProductPrice, isConfigurable } from '../../tools/calculate';
import { IMenuOption, IOrderItem } from '../../types';
import { FiShoppingCart } from 'react-icons/fi';
import { useCallStore } from '../../contexts/call.store';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import fallback from '../../assets/images/noImage.jpg';
import { isEmpty } from 'lodash';
import { imageLoader } from '../../tools/image';
import { OptionCard, VariantCard, RecommendedCard, RecommendedSkeleton } from '..';
import { generateUUID } from '../../tools/generate';
import { CURRENCY } from '../../constants/currency';
import { Modal } from 'flowbite-react';
import { customThemeModal1 } from '../../../styles/themes';
import { useLazyQuery } from '@apollo/client';
import { GET_CROSS_SELLS } from '../../graphql/query';

type Props = {
  onClose: () => void;
  product: any;
  visible: boolean;
};

interface ValidationResult {
  isValid: boolean;
  missingMandatoryOptions: IMenuOption[];
  productId: string | null;
}

const Index = ({ onClose, product = {}, visible }: Props) => {
  const { addOrderItem, addOrderItemOptional, participant } = useCallStore();
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation('language');
  const [selectedItem, setSelectedItem] = useState<IOrderItem | null>(null);
  const [visibleValues, setVisibleValues] = useState(false);
  const [selectedOptoin, setSelectedOption] = useState<any>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [validateOptions, setValidateOptions] = useState([]);

  const [getCrossSells, { data: cross, loading: aiLoading }] = useLazyQuery(GET_CROSS_SELLS);

  const scrollToBottom = () => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTo({
        top: modalBodyRef.current.scrollHeight,
      });
    }
  };

  useEffect(() => {
    if (selectedItem) {
      scrollToBottom();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!isEmpty(validateOptions)) {
      scrollToBottom();
    }
  }, [validateOptions]);

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
      setValidationError('');

      // Fetch cross-sells when modal opens
      if (participant?.menu?.id) {
        getCrossSells({
          variables: {
            menuId: participant.menu.id,
            ids: [product.productId],
          },
        });
      }
    } else {
      setSelectedItem(null);
      setValidationError('');
    }
  }, [visible, product, participant?.menu?.id]);

  const triggerAnimation = () => {
    setAnimate(true); // Reset animation
    setTimeout(() => setAnimate(false), 1000); // Reapply animation after a delay
  };

  const renderRecommendations = (result: any[]) => {
    return (
      <div className="overflow-x-auto">
        <div className="flex space-x-1">
          {result?.map((product) => (
            <div key={product.id} className="min-w-[180px] max-w-[180px]">
              <RecommendedCard isFullWidth product={product} orderItem={null} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const validateMandatoryOptions = (item: IOrderItem): ValidationResult => {
    try {
      // Get the current variant
      const currentVariant = product.variants.find((variant) => variant.id === item.id);

      if (!currentVariant) {
        return {
          isValid: false,
          missingMandatoryOptions: [],
          productId: product.productId,
        };
      }

      // Get mandatory options for the current variant

      // let targets = currentVariant.options.map((option) => ({ ...option, mandatory: true }));

      const mandatoryOptions = currentVariant.options?.filter((option) => option.mandatory) || [];

      // const mandatoryOptions = targets?.filter((option) => option.mandatory) || [];

      if (mandatoryOptions.length === 0) {
        return {
          isValid: true,
          missingMandatoryOptions: [],
          productId: null,
        };
      }

      // Check which mandatory options are missing
      const selectedOptionIds = new Set(item.options.map((option) => option.id));

      const missingOptions = mandatoryOptions.filter((option) => !selectedOptionIds.has(option.id));

      return {
        isValid: missingOptions.length === 0,
        missingMandatoryOptions: missingOptions,
        productId: missingOptions.length > 0 ? product.productId : null,
      };
    } catch (error) {
      console.error('Error in validateMandatoryOptions:', error);
      return {
        isValid: false,
        missingMandatoryOptions: [],
        productId: null,
      };
    }
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
    setValidationError('');
  };

  const handleSelectOption = useCallback(
    (option: any & { value?: string }) => {
      setSelectedItem((prev) => {
        if (!prev) return prev;

        const isOptionSelected = prev.options.some((selectedOption) => selectedOption.id === option.id);

        const updatedOptions = isOptionSelected
          ? prev.options.filter((item) => item.id !== option.id)
          : [...prev.options, option];

        return { ...prev, options: updatedOptions };
      });
      setValidationError('');
    },
    [setSelectedItem],
  );

  const handleRemove = () => {
    setSelectedItem((prev) => (prev && prev.quantity > 1 ? { ...prev, quantity: prev.quantity - 1 } : prev));
  };

  const handleAddItem = () => {
    const validationResult = validateMandatoryOptions(selectedItem);

    if (!validationResult.isValid) {
      scrollToBottom();
      setValidateOptions(validationResult.missingMandatoryOptions);
      const missingOptionsText = validationResult.missingMandatoryOptions.map((option) => option.name).join(', ');
      setValidationError(t('mainPage.validation.mandatoryOptions', { options: missingOptionsText }));
      return;
    }

    if (selectedItem) {
      if (isConfigurable(product)) {
        addOrderItemOptional(selectedItem);
      } else {
        addOrderItem(selectedItem);
      }
    }
    onClose();
  };

  const onSelectOption = (option: any) => {
    setSelectedOption(option);
  };

  const ImageSection = memo(() => (
    <div className="items-center lg:w-96 flex place-content-center object-cover rounded-md">
      <img
        alt="product"
        src={isEmpty(product.image) ? fallback.src : product.image}
        className="rounded-md w-full h-[300px] object-cover"
        loading="lazy"
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
      theme={customThemeModal1}
      className={`w-full p-0 ${animate ? ' animate__animated animate__fadeIn ' : ' '}`}
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <Modal.Header className="bg-current ">
        <span className="text-lg text-white">{t('mainPage.ReadMore')}</span>
      </Modal.Header>
      <Modal.Body>
        <div ref={modalBodyRef} className="w-full h-full overflow-auto">
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
            <div className="text-start ml-2 mt-3">
              <span>{t('mainPage.additional')}</span>
            </div>
            {selectedItem &&
              product.variants
                ?.find((variant) => variant.id === selectedItem.id)
                ?.options?.map((option) => (
                  <OptionCard
                    setVisibleValues={setVisibleValues}
                    selectedOption={selectedOptoin}
                    validateOptions={validateOptions}
                    visibleValues={visibleValues}
                    selectOption={onSelectOption}
                    onSelect={handleSelectOption}
                    isSelected={selectedItem.options.some((selectedOption) => selectedOption.id === option.id)}
                    key={option.id}
                    value={selectedItem.options.find((selectedOption) => selectedOption.id === option.id)?.value}
                    option={option}
                  />
                ))}

            {validationError && <div className="mt-2 text-red-500 text-sm text-center">{validationError}</div>}
          </div>

          {/* Cross-sells Section */}
          {!isEmpty(cross?.getCrossSells) && (
            <div className="flex w-full px-4 py-2 mt-4">
              <span className="text-current text-sm font-semibold">Нэмж захиалах уу</span>
            </div>
          )}

          <div className="flex justify-start px-4 mb-4">
            <div className="px-2 py-2 rounded-2xl rounded-bl-none text-gray-900 text-sm leading-relaxed break-words overflow-hidden">
              <div className="flex overflow-x-auto space-x-3 scrollbar-hide">
                {aiLoading ? <RecommendedSkeleton /> : <>{renderRecommendations(cross?.getCrossSells)}</>}
              </div>
            </div>
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
    </Modal>
  );
};

export default Index;
