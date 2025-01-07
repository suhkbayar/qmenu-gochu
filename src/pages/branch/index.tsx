import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isValidToken, setAccessToken } from '../../providers/auth';
import { useCallStore } from '../../contexts/call.store';
import { GET_BRANCH } from '../../graphql/query';
import { Banner, BottonNavigation, FoodContent, Header, Loader } from '../../components';
import { TYPE } from '../../constants/constant';

const MainContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isValid = isValidToken();
  const { id } = router.query;
  const { setParticipant, order, participant, load } = useCallStore();

  const [getBranch, { data }] = useLazyQuery(GET_BRANCH, {
    pollInterval: 180000,
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setAccessToken(data.getParticipant.token);
      setParticipant(data.getParticipant);

      const services = data.getParticipant.services.length >= 2;
      if (isEmpty(order.type)) {
        if (services) {
          return router.push('/order-type');
        } else {
          load({ ...order, type: TYPE.DELIVERY });
        }
      }

      setLoading(false);
    },
    onError() {
      if (isValid) {
        router.push('/notfound');
      }
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBranch({ variables: { id: id } });
    }
  }, [id]);

  if (loading) return <Loader />;

  return (
    <>
      <Header isBack={participant?.services.length > 1} />
      <Banner />
      <FoodContent />
      <BottonNavigation />
    </>
  );
};

export default MainContent;
