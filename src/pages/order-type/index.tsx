import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallStore } from '../../contexts/call.store';
import { BranchesModal, Header, Loader } from '../../components';
import { TYPE } from '../../constants/constant';
import { DeliveryIcon, TakeAway } from '../../assets/icons/service';
import { useLazyQuery } from '@apollo/client';
import { GET_BRANCH } from '../../graphql/query';
import { setAccessToken } from '../../providers/auth';
import { emptyOrder } from '../../mock';

const OrderType = () => {
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { t } = useTranslation('language');
  const { participant, order, load, setParticipant } = useCallStore();

  const [getBranch, { data }] = useLazyQuery(GET_BRANCH, {
    pollInterval: 180000,
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setAccessToken(data.getParticipant.token);
      setParticipant(data.getParticipant);
    },
    onError() {
      router.push('/notfound');
    },
  });

  const handleOrderType = (type) => {
    load({
      ...emptyOrder,
      type,
    });

    if (type === TYPE.TAKE_AWAY) {
      setVisible(true);
      return;
    } else {
      router.push(`/branch?id=${participant.id}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage?.getItem('partnerId');
      if (id && id !== participant?.id) {
        getBranch({ variables: { id: id } });
      }
    }
  }, [participant]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Loader />;

  return (
    <div className="h-screen bg-[rgba(254,202,66,0.3)]">
      <div className="absolute top-0 w-full ">{participant && <Header />}</div>
      <div className="h-full items-center place-content-center flex gap-10">
        <div
          onClick={() => handleOrderType(TYPE.DELIVERY)}
          className=" p-4 sm:p-10 justify-items-center shadow-lg bg-macDonald rounded-xl hover:shadow-lg cursor-pointer  "
        >
          <div className="w-12 sm:w-16 h-12 sm:h-16 object-cover  max-w-xl">
            <DeliveryIcon />
          </div>
          <span className="text-sm mt-2 sm:text-lg flex w-24 justify-center text-gray-700 font-semibold ">
            {t('mainPage.FastDelivery')}
          </span>
        </div>
        <div
          onClick={() => handleOrderType(TYPE.TAKE_AWAY)}
          className="  p-4 sm:p-10  justify-items-center place-items-center bg-macDonald shadow-lg rounded-xl hover:shadow-lg cursor-pointer"
        >
          <div className="w-12 sm:w-16 h-12 sm:h-16 object-cover  max-w-xl">
            <TakeAway />
          </div>
          <span className="text-sm sm:text-lg mt-2 flex justify-center w-24 font-semibold text-gray-700">
            {t('mainPage.TakeAway')}
          </span>
        </div>
      </div>

      <BranchesModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default OrderType;
