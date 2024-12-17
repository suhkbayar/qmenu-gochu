import { useQuery } from '@apollo/client';
import { GET_ORDERS } from '../../graphql/query';
import { IoArrowBack } from 'react-icons/io5';
import { useCallStore } from '../../contexts/call.store';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { AiOutlineInbox } from 'react-icons/ai';
import { HistoryCard } from '../../components';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { data: orders } = useQuery(GET_ORDERS);

  const { participant } = useCallStore();
  const goBack = () => {
    router.push(`/branch?id=${participant.id}`);
  };

  const paidOrders = orders?.getOrders?.filter((order: any) => order.paymentState === 'PAID') ?? [];

  const EmptyOrder = () => (
    <div className=" grid  place-items-center ">
      <div className="place-items-center">
        <AiOutlineInbox className="text-gray-300 w-20 h-20" />
        <div className="w-full flex place-content-center text-sm text-grayish">{t('mainPage.NoOrderFound')}</div>
      </div>
    </div>
  );

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Захиалгын түүх</span>
        </div>
        <div className="w-full grid gap-2   mt-8 px-4">
          {paidOrders.length === 0 ? (
            <EmptyOrder />
          ) : (
            <div className="grid">
              {paidOrders.map((order: any) => (
                <HistoryCard key={order.id} branch={participant.branch} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Index;
