export type PropsOf<T extends (...args: any) => any> = Parameters<T>[0];
