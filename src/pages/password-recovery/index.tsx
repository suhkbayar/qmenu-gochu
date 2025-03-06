import { IoArrowBack } from 'react-icons/io5';
import { ControlledInput } from '../../components';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { otpSchema } from '../../resolvers';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '../../providers/notification';
import { useMutation } from '@apollo/client';
import { GET_SESSION } from '../../graphql/mutation/register';
import { NotificationType } from '../../constants/constant';
import { isEmpty } from 'lodash';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const { id } = router.query;
  const { showNotification } = useNotificationContext();

  const { control, handleSubmit, watch } = useForm<FieldValues>({
    mode: 'all',
    resolver: yupResolver(otpSchema) as any,
  });

  const [getSession] = useMutation(GET_SESSION, {
    onCompleted: (data) => {
      router.push(`/password-recovery/otp?id=${id}&phone=${phone}&sessionId=${data.getSession}`);
    },
    onError(err) {
      showNotification(NotificationType.WARNING, err.message);
    },
  });

  const { phone } = watch();

  const goBack = () => {
    router.push(`/login?id=${id}`);
  };

  const onSubmit = (data: any) => {
    getSession({ variables: { phone: data.phone, type: 'P' } });
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Нууц үг сэргээх</span>
        </div>

        <form className="w-full grid gap-8 mt-8 px-4">
          <ControlledInput
            control={control}
            text={t('mainPage.PhoneNumber')}
            name="phone"
            inputMode="numeric"
            type="text"
          />
        </form>

        <div className="w-full mt-4 px-4  flex justify-between text-sm place-items-center">
          <button
            onClick={handleSubmit(onSubmit)}
            className={`flex font-semibold w-full cursor-pointer place-content-center items-center rounded-lg ${
              isEmpty(phone) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
            } px-4 py-4 text-sm`}
          >
            {t('mainPage.ToBeContinued')}
          </button>
        </div>
      </div>
    </section>
  );
};
export default Index;
