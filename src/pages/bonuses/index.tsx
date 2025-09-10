import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineGift } from 'react-icons/ai';
import { Loader } from '../../components';
import { GET_LOYALTY_RECORDS } from '../../graphql/query/loyalty';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');

  const { data: loyaltyRecords, loading } = useQuery(GET_LOYALTY_RECORDS);

  const goBack = () => {
    router.push(`/profile?id=${id}`);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineGift className="text-gray-300 w-16 h-16 mb-4" />
      <p className="text-gray-500 text-center">{t('mainPage.NoBonusesAvailable')}</p>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mn-MN');
  };

  const calculateTotalPoints = () => {
    if (!loyaltyRecords?.getLoyaltyRecords) return 0;
    return loyaltyRecords.getLoyaltyRecords.reduce((total: number, record: any) => {
      return total + (record.amount || 0);
    }, 0);
  };

  if (loading) return <Loader />;

  const records = loyaltyRecords?.getLoyaltyRecords || [];
  const totalPoints = calculateTotalPoints();

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={goBack} className="text-2xl text-gray-600" />
          <span className="text-lg text-primary font-semibold">{t('mainPage.Bonuses')}</span>
        </div>

        <div className="px-4 mt-6">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{t('mainPage.YourPoints')}</h2>
              <div className="text-4xl font-bold mb-2">{totalPoints}</div>
              <p className="text-blue-100">{t('mainPage.TotalPointsEarned')}</p>
            </div>
          </div>

          {records.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">{t('mainPage.PointsHistory')}</h3>
              {records.map((record: any) => (
                <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{record.loyalty?.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{record.loyalty?.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">
                          +{record.amount} {t('mainPage.PointsEarned')}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(record.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          record.state === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {record.state === 'ACTIVE' ? t('mainPage.Active') : t('mainPage.Expired')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{t('mainPage.AboutPoints')}</h3>
            <p className="text-sm text-gray-600">{t('mainPage.PointsDescription')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
