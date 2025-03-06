import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_SESSION, VERIFY_SESSION } from '../../../graphql/mutation/register';
import { useNotificationContext } from '../../../providers/notification';
import { NotificationType } from '../../../constants/constant';
import { FourDigits, Loader } from '../../../components';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const [time, setTime] = useState(60000);
  const [pin, setPin] = useState<string>();
  const [start, setStart] = useState(false);
  const { id, phone, sessionId } = router.query;
  const { showNotification } = useNotificationContext();

  const onError = (text: string) => {
    showNotification(NotificationType.WARNING, text);
  };

  const [verifySession, { loading }] = useMutation(VERIFY_SESSION, {
    onCompleted: (data) => {
      if (data.verifySession) {
        router.push(`/password-recovery/reset-password?id=${id}&phone=${phone}&sessionId=${sessionId}`);
      } else {
        onError(t('mainPage.AuthFailed'));
      }
    },
    onError(err) {
      onError(err.message);
    },
  });

  const [getSession] = useMutation(GET_SESSION, {
    onCompleted: (data) => {
      setTime(60000);
      setStart(true);
    },
    onError(err) {
      showNotification(NotificationType.WARNING, err.message);
    },
  });

  const goBack = () => {
    router.push(`/login?id=${id}`);
  };

  const onTryCode = () => {
    getSession({ variables: { phone: phone, type: 'P' } });
  };

  useEffect(() => {
    let interval: any = null;

    if (start) {
      if (time < 1) {
        setStart(false);
      } else {
        interval = setInterval(() => {
          setTime((preTime) => preTime - 10);
        }, 10);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start, time]);

  useEffect(() => {
    if (pin && sessionId) {
      verifySession({ variables: { id: sessionId, pin: pin } });
    }
  }, [pin]);

  if (loading) return <Loader />;

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Нууц үг сэргээх</span>
        </div>

        <form className="w-full grid gap-8 mt-8 px-4">
          <div className="text-sm w-full pt-4 pb-2  text-gray-800  text-start">
            <div>+(976) {phone}</div>
          </div>
          <FourDigits setPin={setPin} />

          <div className="text-sm w-full pt-4 pb-2  text-gray1 dark:text-white text-start">
            <span>
              {t('mainPage.CodeNotReceived')}{' '}
              <button
                disabled={time === 0 ? false : true}
                className={`${time === 0 ? 'text-black' : 'text-gray1'} cursor-pointer`}
                onClick={() => onTryCode()}
              >
                {t('mainPage.GETITAGAIN')}
                {time !== 0 && <span className="text-gray1">({('' + Math.floor((time / 1000) % 60)).slice(-2)})</span>}
              </button>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Index;
