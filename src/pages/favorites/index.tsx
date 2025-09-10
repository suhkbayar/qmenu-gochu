import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Loader } from '../../components';
import { GET_FAVOURITES } from '../../graphql/query/favourites';
import { EDIT_FAVOURITE } from '../../graphql/mutation/favourites';
import { useCallStore } from '../../contexts/call.store';
import { useEffect, useState } from 'react';
import { FavouriteItemType } from '../../types';
import { CURRENCY } from '../../constants/currency';
import { MenuItemState } from '../../constants/constant';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { add } = useCallStore();
  const [activeTab, setActiveTab] = useState<'branches' | 'products'>('products');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const {
    data: favourites,
    loading,
    refetch,
  } = useQuery(GET_FAVOURITES, {
    variables: {
      input: {
        types: [activeTab === 'branches' ? FavouriteItemType.BRANCH : FavouriteItemType.PRODUCT],
        limit: 50,
        offset: 0,
      },
    },
  });
  useEffect(() => {
    if (id) {
      refetch({
        input: {
          types: [activeTab === 'branches' ? FavouriteItemType.BRANCH : FavouriteItemType.PRODUCT],
          limit: 50,
          offset: 0,
        },
      });
    }
  }, [id, activeTab, refetch]);

  const [editFavourite] = useMutation(EDIT_FAVOURITE, {
    onCompleted: () => {
      refetch();
    },
  });

  const goBack = () => {
    router.push(`/profile?id=${id}`);
  };

  const handleRemoveFavourite = (itemId: string) => {
    editFavourite({
      variables: {
        id: itemId,
        type: activeTab === 'branches' ? FavouriteItemType.BRANCH : FavouriteItemType.PRODUCT,
      },
    });
  };

  const handleProductSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleOrderSelected = () => {
    if (selectedProducts.size === 0) return;

    const products = items.filter((item: any) => selectedProducts.has(item.id));
    products.forEach((product: any) => {
      const variant = {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        salePrice: product.price || 0,
        discount: 0,
        options: [],
        state: MenuItemState.ACTIVE,
        quantity: 1,
      };
      add(variant, product.id);
    });

    if (products.length > 0 && products[0].branch?.id) {
      router.push(`/branch?id=${products[0].branch.id}`);
    }
  };

  const calculateTotal = () => {
    return Array.from(selectedProducts).reduce((total, productId) => {
      const product = items.find((item: any) => item.id === productId);
      return total + (product?.price || 0);
    }, 0);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineHeart className="text-gray-300 w-16 h-16 mb-4" />
      <p className="text-gray-500 text-center">
        {activeTab === 'branches' ? t('mainPage.ThereIsNoFavoriteBranch') : t('mainPage.ThereIsNoFavoriteProduct')}
      </p>
    </div>
  );

  if (loading) return <Loader />;

  const items =
    activeTab === 'branches' ? favourites?.getFavourites?.channels || [] : favourites?.getFavourites?.products || [];

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={goBack} className="text-2xl text-gray-600" />
          <span className="text-lg text-primary font-semibold">{t('mainPage.MyFavorite')}</span>
        </div>

        <div className="px-4 mt-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('mainPage.Products')}
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'branches' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('mainPage.Branches')}
            </button>
          </div>
        </div>

        <div className={`px-4 mt-6 ${activeTab === 'products' && items.length > 0 ? 'pb-32' : ''}`}>
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm border p-4 transition-colors ${
                    activeTab === 'products' && selectedProducts.has(item.id)
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {activeTab === 'products' && (
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(item.id)}
                            onChange={() => handleProductSelect(item.id)}
                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        )}
                        <img
                          src={item.logo || item.branch?.logo}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          {item.address && <p className="text-xs text-gray-400 mt-1">{item.address}</p>}
                          {item.distance && <p className="text-xs text-primary mt-1">{item.distance} км зайд</p>}
                          {activeTab === 'products' && item.price && (
                            <p className="text-sm font-semibold text-primary mt-1">
                              {item.price.toLocaleString()} {CURRENCY}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activeTab === 'products' && (
                        <button
                          onClick={() => handleRemoveFavourite(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <AiOutlineHeart className="w-5 h-5 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Button - Only show for products tab */}
        {activeTab === 'products' && items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">{selectedProducts.size} бүтээгдэхүүн сонгогдсон</p>
                {selectedProducts.size > 0 && (
                  <p className="text-lg font-semibold text-primary">
                    Нийт: {calculateTotal().toLocaleString()} {CURRENCY}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleOrderSelected}
              disabled={selectedProducts.size === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                selectedProducts.size === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-600'
              }`}
            >
              <AiOutlineShoppingCart className="w-5 h-5" />
              <span>{selectedProducts.size === 0 ? 'Бүтээгдэхүүн сонгоно уу' : 'Захиалга эхлүүлэх'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Index;
