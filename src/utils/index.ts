import { isEmpty } from 'lodash';

export const numberFormat = new Intl.NumberFormat();
export const optionsCalc = (options: any) => {
  if (isEmpty(options)) {
    return [];
  } else {
    return options
      .map((option: any) => option.price)
      .reduce((acc: any, a: any) => {
        return acc + a;
      }, 0);
  }
};

export const parseConfig = (value: string): any | null => {
  try {
    return value === undefined ? null : JSON.parse(value);
  } catch (error) {
    return value;
  }
};
