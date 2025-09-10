import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineGift } from 'react-icons/ai';
import { Loader } from '../../components';
import { GET_DISCOUNTS } from '../../graphql/query/discounts';
import { useCallStore } from '../../contexts/call.store';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { user } = useCallStore();

  const { data: discounts, loading } = useQuery(GET_DISCOUNTS, {
    variables: {
      input: {
        limit: 50,
        offset: 0,
      },
    },
  });

  const goBack = () => {
    router.push(`/profile?id=${id}`);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineGift className="text-gray-300 w-16 h-16 mb-4" />
      <p className="text-gray-500 text-center">{t('mainPage.NoDiscountCardsAvailable')}</p>
    </div>
  );

  const formatDiscountValue = (discount: any) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}${t('mainPage.DiscountPercentage')}`;
    } else if (discount.type === 'FIXED') {
      return `${discount.value}${t('mainPage.DiscountFixed')}`;
    }
    return t('mainPage.DiscountLabel');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mn-MN');
  };

  if (loading) return <Loader />;

  const discountList = discounts?.getEsDiscounts?.discounts || [];

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={goBack} className="text-2xl text-gray-600" />
          <span className="text-lg text-primary font-semibold">{t('mainPage.DiscountCards')}</span>
        </div>

        <div className="px-4 mt-6">
          {discountList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {discountList.map((discount: any) => (
                <div
                  key={discount.id}
                  className="bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{discount.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          {formatDiscountValue(discount)}
                        </span>
                      </div>
                    </div>
                    {discount.image && (
                      <img src={discount.image} alt={discount.name} className="w-16 h-16 rounded-lg object-cover" />
                    )}
                  </div>

                  <div className="border-t border-white border-opacity-20 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{discount.channel?.name}</span>
                      </div>
                      {discount.distance && (
                        <span className="text-blue-100">
                          {discount.distance} {t('mainPage.DistanceAway')}
                        </span>
                      )}
                    </div>
                  </div>

                  {(discount.startDate || discount.endDate) && (
                    <div className="mt-3 text-xs text-blue-100">
                      {discount.startDate && (
                        <p>
                          {t('mainPage.StartDate')} {formatDate(discount.startDate)}
                        </p>
                      )}
                      {discount.endDate && (
                        <p>
                          {t('mainPage.EndDate')} {formatDate(discount.endDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Index;
