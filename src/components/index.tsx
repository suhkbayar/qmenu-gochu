import React from 'react';
import dynamic from 'next/dynamic';
import CardSkelton from './Skelton/CardSkelton';
import ListSkelton from './Skelton/ListSkelton';
import DraftCardSkelton from './Skelton/DraftCardSkelton';

export const FourDigits = dynamic(() => import('./Masks/FourDigitsMask'));

export const SearchEmpty = dynamic(() => import('./Empty/Search'));

export const Empty = dynamic(() => import('./Empty/Empty'));
export const Step = dynamic(() => import('./Step/index'));
export const Header = dynamic(() => import('../layouts/Header'));
export const FoodContent = dynamic(() => import('../content/FoodContent'));

export const MainContent = dynamic(() => import('../content/MainContent'));
export const BottonNavigation = dynamic(() => import('../content/BottomNavigation'));
export const Banner = dynamic(() => import('../layouts/Banner'));

export const ProductCard = dynamic(() => import('../components/Card/Product'), {
  loading: () => <CardSkelton />,
});

export const WaitPaymentModal = dynamic(() => import('./Modal/WaitPayment'));

export const DraftOrder = dynamic(() => import('../components/DraftOrder/index'));
export const VariantCard = dynamic(() => import('../components/Card/VariantCard'));
export const OptionValuesModal = dynamic(() => import('../components/Modal/OptionValues'));
export const OptionCard = dynamic(() => import('../components/Card/OptionCard'));
export const ProductModal = dynamic(() => import('../components/Modal/ProductModal'));
export const BottomNavigation = dynamic(() => import('../content/BottomNavigation'));
export const ControlledTextArea = dynamic(() => import('../components/ControlledForms/ControlledTextArea'));
export const Loader = dynamic(() => import('../components/Loader/Loader'));
export const DraftModal = dynamic(() => import('../components/Modal/DraftModal'));

export const ScheduleDeliveryModal = dynamic(() => import('../components/Modal/ScheduleDeliveryModal'));

export const ControlledInput = dynamic(() => import('../components/ControlledForms/ControlledInput'));

export const ControlledLocation = dynamic(() => import('../components/ControlledForms/ControlledLocation'));

export const AddLocationModal = dynamic(() => import('../components/Modal/AddLocationModal'));

export const VatForm = dynamic(() => import('../components/Forms/VatForm'));
export const BankFrom = dynamic(() => import('../components/Forms/Bank'));
export const QpayForm = dynamic(() => import('../components/Forms/Qpay'));

export const ReceiptModal = dynamic(() => import('../components/Modal/RecieptModal'));

export const HistoryCard = dynamic(() => import('./Card/HistoryCard'), {
  loading: () => <ListSkelton />,
});

export const ItemCard = dynamic(() => import('./Card/ItemCard'), {
  loading: () => <DraftCardSkelton />,
});

export const OrderTypeStepper = dynamic(() => import('./Step/OrderStep'));

export const TimeTable = dynamic(() => import('./TimeTable/index'));
export const Contact = dynamic(() => import('./Info/Contact'));
