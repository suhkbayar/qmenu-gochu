import * as yup from 'yup';
import { PATTERN_PHONE } from '../constants/pattern';

export const userSchema = yup.object().shape({
  phone: yup.string().required('Та утасны дугаар оруулна уу').matches(PATTERN_PHONE, 'Утасны дугаар алдаатай байна'),
  userName: yup.string().required('Та өөрийн нэр оруулна уу'),
  location: yup.string().required('Та хаяг оруулна уу'),
});

export const loginSchema = yup.object().shape({
  phone: yup.string().required('Та утасны дугаар оруулна уу').matches(PATTERN_PHONE, 'Утасны дугаар алдаатай байна'),
  password: yup.string().required('Та нууц үгээ оруулна уу'),
});

export const otpSchema = yup.object().shape({
  phone: yup.string().required('Та утасны дугаар оруулна уу').matches(PATTERN_PHONE, 'Утасны дугаар алдаатай байна'),
});

export const registerSchema = yup.object().shape({
  gender: yup.string().required('Хүйс сонгоно уу.'),
  name: yup.string().required('Та өөрийн нэрийг оруулна уу'),
  password: yup
    .string()
    .required('Та нууц үгээ оруулна уу')
    .min(6, 'Нууц үг 6 тэмдэгтээс багагүй байх ёстой')
    .matches(/[A-Z]/, 'Нууц үгэнд том үсэг байх ёстой')
    .matches(/[a-z]/, 'Нууц үгэнд жижиг үсэг байх ёстой')
    .matches(/[0-9]/, 'Нууц үгэнд тоо байх ёстой'),
  repeatPassword: yup
    .string()
    .required('Та нууц үгээ давтаж оруулна уу')
    .oneOf([yup.ref('password'), null], 'Нууц үг таарахгүй байна'),
  year: yup.string().required('Та төрсөн он сонгоно уу'),
  month: yup.string().required('Та төрсөн сар сонгоно уу'),
  day: yup.string().required('Та төрсөн өдөр сонгоно уу'),
});
