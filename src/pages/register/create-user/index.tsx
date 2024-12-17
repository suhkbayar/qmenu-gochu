import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { Controller, FieldError, FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/client';
import { NotificationType } from '../../../constants/constant';
import { useNotificationContext } from '../../../providers/notification';
import { registerSchema } from '../../../resolvers';
import { SIGN_UP } from '../../../graphql/mutation/sign';
import { useCallStore } from '../../../contexts/call.store';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../providers/auth';
import { GET_ORDERS, ME } from '../../../graphql/query';
import { IoArrowBack } from 'react-icons/io5';
import { isEmpty } from 'lodash';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { id, phone, sessionId } = router.query;
  const { showNotification } = useNotificationContext();
  const { participant, setUser } = useCallStore();
  const { authenticate } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(registerSchema) as any,
  });

  const [getMe, { data, refetch: refetchMe }] = useLazyQuery(ME, {
    onCompleted: (data) => {
      setUser(data.me);
    },
  });

  const [getOrder, { refetch }] = useLazyQuery(GET_ORDERS);

  const onSuccess = async () => {
    await refetch();
    await refetchMe();
    showNotification(NotificationType.SUCCESS, t('mainPage.LoginSuccess'));
    router.push(`/branch?id=${id}`);
  };

  const [signUp] = useMutation(SIGN_UP, {
    onCompleted: (data) => {
      authenticate(data.signUp.token, () => {
        onSuccess();
      });
    },
    onError(err) {
      showNotification(NotificationType.WARNING, err.message);
    },
  });

  const onRegister = (data: any) => {
    signUp({
      variables: {
        input: {
          email: '',
          gender: capitalizeFirstLetter(data.gender),
          name: data.name,
          password: data.password,
          phone: phone,
          session: sessionId,
          year: data.year,
          month: data.month,
          day: data.day,
        },
      },
    });
  };

  const getYears = () => {
    let d = new Date();
    let y = d.getFullYear();

    const times = [];
    for (let i = 0; i < 60; i++) {
      times.push({ key: i, label: y-- });
    }
    return times;
  };

  const getDays = (month: string) => {
    const days = [];
    const totalDays = new Date(new Date().getFullYear(), parseInt(month, 10), 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push({ key: i, label: i });
    }
    return days;
  };

  let Days = getDays(watch('month'));

  const Years = getYears();

  useEffect(() => {
    setValue('day', '');
    Days = getDays(watch('month'));
  }, [watch('month')]);

  const goBack = () => {
    router.push(`/login?id=${id}`);
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Хэрэглэгчийн бүртгэл</span>
        </div>
        <form className="w-full grid gap-4 mt-8 px-4" onSubmit={handleSubmit(onRegister)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, formState: { errors } }) => (
              <div className="space-y-2 w-full">
                <p className="text-sm font-semibold text-gray-800 "> {t('mainPage.PleaseEnterName')}</p>
                <input
                  {...field}
                  type="text"
                  className=" w-full bg-white placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors['name'] as FieldError)?.message}</p>
              </div>
            )}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field, formState: { errors } }) => (
              <div className="space-y-2 w-full">
                <p className="text-sm font-semibold text-gray-800 "> Хүйс</p>

                <select
                  {...field}
                  className=" w-full bg-white placeholder:text-sm px-4 py-2 text-gray-800  transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  <option value="" disabled hidden></option>
                  <option value="male">{t('mainPage.Male')}</option>
                  <option value="female"> {t('mainPage.Woman')}</option>
                  <option value="custom"> {t('mainPage.Other')}</option>
                </select>
                <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors['gender'] as FieldError)?.message}</p>
              </div>
            )}
          />
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
          <div className="inline-grid w-full">
            <p className="text-sm font-semibold mb-2 text-gray-800 ">Төрсөн он</p>

            <div className="grid grid-cols-6 w-full items-center justify-between gap-2">
              <div className=" col-span-2 ">
                <select
                  className=" w-full px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                  {...register('year', { required: true })}
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Он
                  </option>
                  {Years.map((year) => (
                    <option key={year.key} value={year.label}>
                      {year.label}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors['year'] as FieldError)?.message}</p>
                )}
              </div>

              <div className="  col-span-2">
                <select
                  className="  w-full px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                  {...register('month', { required: true })}
                  defaultValue=""
                >
                  <option disabled hidden value="">
                    Сар
                  </option>
                  {Array.from({ length: 12 }, (_, i) => ({ key: i + 1, label: i + 1 })).map((month) => (
                    <option key={month.key} value={month.label}>
                      {month.label}
                    </option>
                  ))}
                </select>
                {errors.month && (
                  <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors['month'] as FieldError)?.message}</p>
                )}
              </div>

              <div className=" col-span-2 ">
                <select
                  className="  w-full px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
                  {...register('day', { required: true })}
                  disabled={isEmpty(watch('month'))}
                  defaultValue=""
                >
                  <option disabled hidden value="">
                    Өдөр
                  </option>
                  {Days.map((day) => (
                    <option key={day.key} value={day.label}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {errors.day && (
                  <p className="mt-2 mb-2 text-red-500 text-xs">{errors && (errors['day'] as FieldError)?.message}</p>
                )}
              </div>
            </div>
          </div>

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
