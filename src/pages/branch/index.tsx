import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isValidToken, setAccessToken } from '../../providers/auth';
import { useCallStore } from '../../contexts/call.store';
import { GET_BRANCH } from '../../graphql/query';
import { emptyOrder } from '../../mock';
import { Banner, BottonNavigation, FoodContent, Header, Loader } from '../../components';

const MainContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isValid = isValidToken();
  const { id } = router.query;
  const { setParticipant, order, load } = useCallStore();
  const [getBranch, { data }] = useLazyQuery(GET_BRANCH, {
    pollInterval: 180000,
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setAccessToken(data.getParticipant.token);
      setParticipant(data.getParticipant);
      if (data.getParticipant.orderable && isEmpty(order.items)) {
        load(emptyOrder);
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
      <Header />
      <Banner />
      <FoodContent />
      <BottonNavigation />
    </>
  );
};

export default MainContent;
