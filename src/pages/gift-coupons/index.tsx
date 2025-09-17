import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineGift, AiOutlineQrcode } from 'react-icons/ai';
import { useState } from 'react';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const [activeTab, setActiveTab] = useState<'available' | 'myCoupons'>('available');

  // const { data: availableCoupons, loading: couponsLoading } = useQuery(GET_AVAILABLE_COUPONS);
  // const { data: myCoupons, loading: myCouponsLoading } = useQuery(GET_MY_COUPONS);

  const goBack = () => {
    router.push(`/profile?id=${id}`);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineGift className="text-gray-300 w-16 h-16 mb-4" />
      <p className="text-gray-500 text-center">
        {activeTab === 'available' ? 'Одоогоор бэлэн купон байхгүй байна' : 'Таны купон байхгүй байна'}
      </p>
    </div>
  );

  const ComingSoonState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineGift className="text-gray-300 w-16 h-16 mb-4" />
      <p className="text-gray-500 text-center mb-4">Купон үйлчилгээ хэрэгжүүлэх ажил хийгдэж байна</p>
      <p className="text-sm text-gray-400 text-center">Удахгүй купон авах, ашиглах боломжтой болно</p>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mn-MN');
  };

  // Mock data :
  // const mockMyCoupons = [
  //   {
  //     id: '1',
  //     code: 'WELCOME20',
  //     name: 'Тавтай морил',
  //     amount: 20,
  //     type: 'PERCENTAGE',
  //     state: 'USED',
  //     usedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  //   },
  // ];

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={goBack} className="text-2xl text-gray-600" />
          <span className="text-lg text-primary font-semibold">{t('mainPage.GiftCoupons')}</span>
        </div>

        <div className="px-4 mt-6">
          {/* <div className="flex bg-gray-100 rounded-lg p-1"> */}
          {/* <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'available' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Бэлэн купон
            </button>
            <button
              onClick={() => setActiveTab('myCoupons')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'myCoupons' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Миний купон
            </button> */}
          {/* </div> */}
        </div>

        <div className="px-4 mt-6">
          {/* {activeTab === 'available' ? (
            <ComingSoonState />
          ) : mockMyCoupons.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {mockMyCoupons.map((coupon: any) => (
                <div key={coupon.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{coupon.code}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {coupon.type === 'PERCENTAGE' ? `${coupon.amount}% хөнгөлөлт` : `${coupon.amount}₮ хөнгөлөлт`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {coupon.state === 'USED' ? 'Ашиглагдсан' : 'Идэвхтэй'}
                        </span>
                        {coupon.usedAt && <span className="text-xs text-gray-500">{formatDate(coupon.usedAt)}</span>}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <AiOutlineQrcode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}
          <ComingSoonState />
        </div>
      </div>
    </section>
  );
};

export default Index;
