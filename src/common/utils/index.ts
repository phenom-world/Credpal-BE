import { ObjectData } from '../../types';

export type IActivationToken = string;

export const generateOtp = (): IActivationToken => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const isObject = (obj: ObjectData = {}): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const exclude = <T extends ObjectData, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<T, Key>;
};

export const pick = <T extends ObjectData, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Pick<T, Key> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as Key))
  ) as Pick<T, Key>;
};

export const sanitize = <T extends ObjectData>(obj?: T): Partial<T> => {
  if (!obj) return {};
  const pickedObj: Partial<T> = {};
  Object.keys(obj).forEach((key: keyof T) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      pickedObj[key] = obj[key];
    }
  });
  return pickedObj;
};

export const isValue = (value?: string) => {
  if (value !== 'undefined' && value !== 'null' && value) {
    return value;
  }
  return undefined;
};
