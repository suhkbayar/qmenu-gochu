import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
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
  const { setParticipant, order, load } = useCallStore();
  const [isMounted, setIsMounted] = useState(false);

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading) return <Loader />;

  if (!isMounted) return <Loader />;

  return (
    <>
      <Header isBack />
      <Banner />
      <FoodContent />
      <BottonNavigation />
    </>
  );
};

export default MainContent;
