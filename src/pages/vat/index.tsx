import { useRouter } from 'next/router';
import { Step, VatForm } from '../../components';
import logo from '../../assets/icons/eBarimt_logo.png';
import { useCallStore } from '../../contexts/call.store';
import { FieldValues, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { CURRENCY } from '../../constants/currency';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { order, load, participant } = useCallStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues: {
      vatType: '1',
    },
  });

  const { vatType, buyer } = watch();

  const onSubmit = (data: any) => {
    let targetVat = {};
    if (data.vatType === '1') {
      targetVat = {
        vatType: '1',
      };
    } else {
      targetVat = {
        vatType: '3',
        buyer: data.buyer,
        register: data.register,
      };
    }
    load({ ...order, ...targetVat });

    router.push(`/payment?id=${id}`);
  };

  const isContinueButtonEnabled = () => {
    if (vatType === '3') {
      return !isEmpty(buyer);
    } else if (vatType === '1') {
      return true;
    }
  };

  const goBack = () => {
    router.push(`/delivery-type?id=${participant.id}`);
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        {/* Step Indicator */}
        <div className="w-full mt-4 px-4">
          <Step totalSteps={5} activeStep={3} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className=" mt-5  h-[85vh] overflow-auto	 ">
          <img src={logo.src} alt="logo" className="w-28 mx-auto" />
          <VatForm register={register} errors={errors} setValue={setValue} reset={reset} />
          <span className="text-xs pt-1 text-red-500 dark:text-white">{errors.register?.message}</span>
        </form>

        <div className=" fixed cursor-pointer bottom-0 p-4 sm:bottom-0 transition-all duration-500  md:bottom-5 lg:bottom-5 w-full   sm:w-full md:w-6/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12">
          <div className="w-full flex justify-between text-sm place-items-center">
            <div
              onClick={() => goBack()}
              className="flex p-4 rounded-lg bg-gray-300 px-6
                     "
            >
              <span className="text-white">Буцах</span>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              className={`flex gap-4  font-semibold cursor-pointer place-content-center items-center rounded-lg ${
                !isContinueButtonEnabled() ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              <span>{t('mainPage.ToBeContinued')}</span>
              {order?.items.length > 0 && (
                <>
                  <span className="block text-white text-md font-semibold">
                    ( {order?.totalAmount.toLocaleString()} {CURRENCY} )
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
