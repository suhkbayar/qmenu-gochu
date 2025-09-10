import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { PATTERN_PHONE } from '../../constants/pattern';
import { ICustomer } from '../../types/customer';
import { CgSpinner } from 'react-icons/cg';

type FormData = {
  phone: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
};

type Props = {
  onSubmit: (values: FormData) => void;
  user: ICustomer;
  loading: boolean;
};

const Index = ({ onSubmit, user, loading }: Props) => {
  const { t } = useTranslation('language');
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [gender, setGender] = useState<string>(user.gender);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      phone: user.phone,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      gender: user.gender,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (user) {
      const allFields = ['gender', 'phone', 'email', 'firstName', 'lastName'];
      const hasBooleanFieldChanged = allFields.some((field) => watchedValues[field] !== user[field]);
      setIsFormChanged(hasBooleanFieldChanged);
    }
  }, [user, watchedValues]);

  const onGenders = (gender) => {
    setGender(gender);
    setValue('gender', gender);
  };

  return (
    <div className="md:flex md:justify-center ">
      <form
        className=" w-full md:w-1/3  grid h-[calc(100vh-130px)] place-content-between place-items-center  py-5 px-8"
        action=""
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="inline-grid w-full ">
            <label className="text-gray-700 font-normal py-2 dark:text-white" htmlFor="">
              {t('mainPage.PhoneNumber')}
            </label>
            <input
              readOnly
              className="px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
              autoFocus
              inputMode="numeric"
              type="text"
              {...register('phone', { required: true, pattern: PATTERN_PHONE })}
            />
            {errors.phone && (
              <span className="text-xs pt-1 text-red-500 dark:text-white">{t('mainPage.PleaseEnterPhoneNumber')}</span>
            )}
          </div>

          <div className="inline-grid w-full ">
            <label className="text-gray-700 font-normal text-sm py-2 dark:text-white" htmlFor="">
              Овог
            </label>
            <input
              className="px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
              autoFocus
              type="text"
              {...register('lastName', { required: false })}
            />
            {errors.lastName && (
              <span className="text-xs pt-1 text-red-500 dark:text-white">{t('mainPage.PleaseEnterName')}</span>
            )}
          </div>
          <div className="inline-grid w-full ">
            <label className="text-gray-700 font-normal text-sm py-2 dark:text-white" htmlFor="">
              Нэр
            </label>
            <input
              className="px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
              type="text"
              {...register('firstName', { required: true })}
            />
            {errors.firstName && (
              <span className="text-xs pt-1 text-red-500 dark:text-white">{t('mainPage.PleaseEnterName')}</span>
            )}
          </div>

          <div className="inline-grid w-full ">
            <label className="text-gray-700 font-normal text-sm py-2 dark:text-white" htmlFor="">
              {t('mainPage.email')}
            </label>
            <input
              className="px-4 py-2 text-gray1 transition duration-300 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
              {...register('email', { required: false })}
            />
            {errors.email && (
              <span className="text-xs pt-1 text-red-500 dark:text-white">{t('mainPage.PleaseEnterEmail')}</span>
            )}
          </div>

          <div className="inline-grid w-full ">
            <label className="text-gray-700 font-normal py-2 text-sm  dark:text-white" htmlFor="">
              Хүйс
            </label>
            <div className="flex items-center justify-between grid-cols-3 gap-2 ">
              <div
                onClick={() => onGenders('Female')}
                className={` p-2 cursor-pointer flex gap-1 place-items-center rounded-lg ${
                  gender === 'Female'
                    ? 'bg-lightapricot  border border-current text-current'
                    : 'bg-gainsboro  border border-grayish text-gray-700'
                } text-center place-content-center`}
              >
                <IoMdFemale className="text-lg" />
                <input
                  {...register('gender', { required: true })}
                  type="radio"
                  name="gender"
                  value="Female"
                  id="Female"
                />
                {t('mainPage.Woman')}
              </div>

              <div
                onClick={() => onGenders('Male')}
                className={` p-2 cursor-pointer flex gap-1 place-items-center rounded-lg ${
                  gender === 'Male'
                    ? 'bg-lightapricot  border border-current text-current'
                    : 'bg-gainsboro  border border-grayish text-gray-700'
                } text-center place-content-center`}
              >
                <IoMdMale className="text-lg" />
                <input
                  {...register('gender', { required: true })}
                  type="radio"
                  name="gender"
                  value="Male"
                  className="form-check-input "
                  id="Male"
                />
                {t('mainPage.Male')}
              </div>

              <div
                onClick={() => onGenders('Custom')}
                className={` p-2 cursor-pointer rounded-lg ${
                  gender === 'Custom'
                    ? 'bg-lightapricot  border border-current text-current'
                    : 'bg-gainsboro  border border-grayish text-gray-700'
                } text-center place-content-center`}
              >
                <input
                  {...register('gender', { required: true })}
                  type="radio"
                  name="gender"
                  value="Custom"
                  className="form-check-input"
                  id="Custom"
                />
                {t('mainPage.Other')}
              </div>
            </div>

            {errors.gender && (
              <span className="text-xs pt-1 text-red-500 dark:text-white">{t('mainPage.EnterYourGender')}</span>
            )}
          </div>
        </div>
        <div className="pt-4 pb-2  w-full ">
          <button
            disabled={!isFormChanged}
            type="submit"
            className={`  w-full flex items-center  place-content-center rounded-lg px-4 py-2  md:px-5 md:py-3     ${
              isFormChanged ? 'bg-current hover:bg-current text-white' : 'bg-gray-200 hover:bg-gray-200 text-gray1'
            } duration-300`}
          >
            {loading && <CgSpinner className="text-lg mr-1 animate-spin" />}
            {t('mainPage.Update')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Index;
