import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Loader from '../../components/Loader/Loader';
import { CURRENT_TOKEN } from '../../graphql/mutation/token';
import { AuthContext, getPayload } from '../../providers/auth';
import { useCallStore } from '../../contexts/call.store';
import { emptyOrder } from '../../mock';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { load, setSelectedParticipant } = useCallStore();
  const { authenticate, changeQr } = useContext(AuthContext);

  const [getCurrentToken, { loading }] = useMutation(CURRENT_TOKEN, {
    onCompleted: (data) => {
      authenticate(data.getToken.token, () => {});
      getPayload();
      localStorage.setItem('partnerId', id as string);
      router.push(`branch?id=${id}`);
      load(emptyOrder);
      setSelectedParticipant(null);
    },
    onError(err) {
      // router.push('/notfound');
    },
  });

  React.useEffect(() => {
    if (id) {
      console.log(id);
      changeQr(id.toString());
      getCurrentToken({ variables: { code: id, type: 'K' } });
    }
  }, [id]);

  if (loading) return <Loader />;

  return <Loader />;
};

export default Index;
