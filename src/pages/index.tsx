import type { NextPage } from 'next';
import Loader from '../components/Loader/Loader';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const navigateToPartner = async () => {
      const targetUrl = `/partner?id=78f43334-ab6d-491b-b7d3-b65a12bb36c8`;

      try {
        await router.push(targetUrl);
      } catch (error) {
        console.error('Failed to navigate:', error);
      }
    };

    navigateToPartner();
  }, [router]);

  return <Loader />;
};

export default Home;
