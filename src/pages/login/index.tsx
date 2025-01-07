import { useLazyQuery, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { IoArrowBack } from 'react-icons/io5';
import { AuthContext } from '../../providers/auth';
import { SIGN_IN } from '../../graphql/mutation/sign';
import { useNotificationContext } from '../../providers/notification';
import { GET_ORDERS, ME } from '../../graphql/query';
import { useCallStore } from '../../contexts/call.store';
import { NotificationType } from '../../constants/constant';
import { useTranslation } from 'react-i18next';
import { ControlledInput, Loader } from '../../components';
import { isEmpty } from 'lodash';
import { loginSchema } from '../../resolvers';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { id } = router.query;
  const { authenticate } = useContext(AuthContext);
  const { showNotification } = useNotificationContext();
  const { setUser } = useCallStore();

  const { control, handleSubmit, watch } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(loginSchema) as any,
  });

  const [getMe, { refetch: refetchMe }] = useLazyQuery(ME, {
    onCompleted: (data) => {
      setUser(data.me);
    },
  });
  const [getOrder, { refetch }] = useLazyQuery(GET_ORDERS);

  const onSuccess = async () => {
    await refetch();
    await refetchMe();
    showNotification(NotificationType.SUCCESS, t('mainPage.LoginSuccess'));
    goBack();
  };

  const [signIn, { loading }] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      authenticate(data.signIn.token, () => {
        onSuccess();
      });
    },
    onError(err) {
      showNotification(NotificationType.WARNING, err.message);
    },
  });

  const { phone, password } = watch();
  const goBack = () => {
    router.push(`/branch?id=${id}`);
  };

  const goRegister = () => {
    router.push(`/register?id=${id}`);
  };

  const onSubmit = (data: FieldValues) => {
    signIn({ variables: { phone: data.phone, password: data.password } });
  };

  const goPasswordRecovery = () => {
    router.push('/password-recovery');
  };

  if (loading) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Нэвтрэх</span>
        </div>
        <form className="w-full grid gap-4 mt-8 px-4">
          <ControlledInput
            control={control}
            text={t('mainPage.PhoneNumber')}
            name="phone"
            inputMode="numeric"
            type="text"
          />
          <ControlledInput
            control={control}
            text={t('mainPage.Password')}
            name="password"
            inputMode="text"
            type="password"
          />
          <div className="text-sm w-full pt-0 pb-2  text-current text-end">
            <span onClick={() => goPasswordRecovery()} className="cursor-pointer">
              {t('mainPage.ForgotPassword')}
            </span>
          </div>
          <div className="w-full flex justify-between text-sm place-items-center">
            <button
              onClick={handleSubmit(onSubmit)}
              className={`flex font-semibold w-full cursor-pointer place-content-center items-center rounded-lg ${
                isEmpty(phone && password) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              {t('mainPage.login')}
            </button>
          </div>
        </form>

        <div className="w-full mt-4 px-4 flex justify-between text-sm place-items-center">
          <button
            onClick={goRegister}
            className="w-full rounded-lg  px-4 py-4   bg-white border border-current text-current hover:bg-white duration-300"
          >
            {t('mainPage.register')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Index;
