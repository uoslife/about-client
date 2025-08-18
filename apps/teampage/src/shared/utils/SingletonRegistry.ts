export interface SingletonRegistry {}

export const Singletons: Readonly<SingletonRegistry> = {} as any;

export const SingletonRegister = (name: keyof SingletonRegistry) => {
  return (constructor: new (...args: any[]) => any) => {
    Object.defineProperty(Singletons, name, {
      get: function () {
        const value = new constructor();
        Object.defineProperty(Singletons, name, {
          value,
        });
        return value;
      },
      configurable: true,
    });
  };
};
