export type ObjectData = {
   
  [key: string]: any;
};

export type Paginate = { limit: number; offset: number };
export type PaginateResponse<T> = {
  count: number;
  records: T;
};

export type Intent = 'authorize' | 'capture';
