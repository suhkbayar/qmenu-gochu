import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { useCallStore } from '../../contexts/call.store';
import { AuthContext, getPayload } from '../../providers/auth';
import { useContext } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORDERS, ME } from '../../graphql/query';
import { CURRENT_TOKEN } from '../../graphql/mutation/token';
import { Loader } from '../../components';
import { SlUserFemale, SlUser } from 'react-icons/sl';
import { FiChevronRight } from 'react-icons/fi';
import userInfo from '../../assets/user/userInfo.png';
import heart from '../../assets/user/heart.png';
import discount from '../../assets/user/Discount.svg';
import Calories from '../../assets/user/Calories.svg';
import Basket from '../../assets/user/Basket.svg';
import Camera from '../../assets/user/Camera.svg';
import logout from '../../assets/user/logout.png';
import bonus from '../../assets/user/bonus.svg';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { id } = router.query;

  const { setUser } = useCallStore();
  const { authenticate } = useContext(AuthContext);
  const {
    data,
    refetch: refetchMe,
    loading: meing,
  } = useQuery(ME, {
    onCompleted: (data) => {
      setUser(data.me);
    },
  });

  const [getOrder, { refetch }] = useLazyQuery(GET_ORDERS);

  const onSuccess = async (id) => {
    await refetch();
    await refetchMe();
    router.push(`branch?id=${id}`);
  };

  const [getCurrentToken, { loading }] = useMutation(CURRENT_TOKEN, {
    onCompleted: (data) => {
      authenticate(data.getToken.token, () => onSuccess(data.getToken.id));
    },
    onError(err) {
      router.push('/notfound');
    },
  });

  const goBack = () => {
    router.push(`/branch?id=${id}`);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    getCurrentToken({ variables: { code: id, type: 'K' } });
  };

  if (loading || meing) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Хувийн мэдээлэл</span>
        </div>
        <form className="w-full grid gap-2 mt-8 px-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex place-items-center place-content-center bg-gainsboro w-20 h-20 rounded-full">
              {data && data.me?.gender === 'Male' ? (
                <SlUser className="text-grayish  w-10 h-10 " />
              ) : (
                <SlUserFemale className="text-grayish  w-10 h-10" />
              )}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center mb-2">{data && data.me?.firstName}</h2>
          <p className="text-gray-500 text-center mb-2 dark:text-white">{data && data.me?.phone}</p>

          <div className=" p-3 md:flex md:justify-center">
            <ul className="  space-y-2">
              <div className="flex cursor-pointer hover:bg-gainsboro dark:hover:bg-gray1 items-center rounded-lg  place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={userInfo.src} alt={userInfo.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">{t('mainPage.CustomerInformation')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={heart.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">{t('mainPage.MyFavorite')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1  items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={discount.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">{t('mainPage.DiscountCards')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={Basket.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">Миний сагс</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={bonus.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">Урамшуулал </span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={Calories.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">{t('mainPage.GiftCoupon')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div className="flex  cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2">
                <div className="flex place-content-between">
                  <img src={Camera.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white ">{t('mainPage.ShareWithOthers')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>

              <div
                onClick={() => onLogout()}
                className="flex cursor-pointer hover:bg-gainsboro rounded-lg dark:hover:bg-gray1 items-center place-content-between p-2"
              >
                <div className="flex place-content-between">
                  <img src={logout.src} className="h-7 w-7 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-white">{t('mainPage.Signout')}</span>
                </div>
                <FiChevronRight className="text-gray-500 text-xl dark:text-white" />
              </div>
            </ul>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Index;
