import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '../../../providers/notification';
import { Controller, FieldError, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPassSchema } from '../../../resolvers';
import { useMutation } from '@apollo/client';
import { NotificationType } from '../../../constants/constant';
import { FORGOT_PASSWORD } from '../../../graphql/mutation/sign';
import { IoArrowBack } from 'react-icons/io5';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { id, sessionId } = router.query;
  const { showNotification } = useNotificationContext();

  const { control, handleSubmit } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(resetPassSchema) as any,
  });

  const [passwordReset] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      if (data.passwordReset) {
        onSuccess();
      }
    },
    onError(err) {
      showNotification(NotificationType.WARNING, err.message);
    },
  });

  const onSuccess = async () => {
    showNotification(NotificationType.SUCCESS, t('mainPage.SignupSuccess'));
    router.push(`/login?id=${id}`);
  };

  const onRegister = (data: any) => {
    passwordReset({
      variables: {
        password: data.password,
        session: sessionId,
      },
    });
  };

  const goBack = () => {
    router.push(`/login?id=${id}`);
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Нууц үг сэргээх</span>
        </div>
        <form className="w-full grid gap-4 mt-8 px-4" onSubmit={handleSubmit(onRegister)}>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field, formState: { errors } }) => (
              <div className="space-y-2 w-full">
                <p className="text-sm font-semibold text-gray-800 "> {t('mainPage.UserPassword')}</p>
                <input
                  {...field}
                  type="password"
                  className=" w-full bg-white placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <p className="mt-2 mb-2 text-red-500 text-xs">
                  {errors && (errors['password'] as FieldError)?.message}
                </p>
              </div>
            )}
          />
          <Controller
            name="repeatPassword"
            control={control}
            defaultValue=""
            render={({ field, formState: { errors } }) => (
              <div className="space-y-2 w-full">
                <p className="text-sm font-semibold text-gray-800 ">{t('mainPage.RepeatUserPassword')}</p>

                <input
                  {...field}
                  type="password"
                  className=" w-full bg-white placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <p className="mt-2 mb-2 text-red-500 text-xs">
                  {errors && (errors['repeatPassword'] as FieldError)?.message}
                </p>
              </div>
            )}
          />

          <button
            type="submit"
            className={`flex font-semibold w-full cursor-pointer place-content-center items-center rounded-lg bg-current text-white px-4 py-4 text-sm`}
          >
            Бүртгүүлэх
          </button>
        </form>
      </div>
    </section>
  );
};

export default Index;
