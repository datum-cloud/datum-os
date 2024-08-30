export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

export type ValueOf<T> = T[keyof T];

export type MapValueOf<A> = A extends Map<any, infer V> ? V : never;

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type AsyncFunction = (...args: any[]) => Promise<any>;

export type Optional<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Primitive = string | number | symbol;

export type GenericObject = Record<Primitive, unknown>;

type Join<L extends Primitive | undefined, R extends Primitive | undefined> = L extends
  | string
  | number
  ? R extends string | number
    ? L extends undefined
      ? R
      : `${L}.${R}`
    : L
  : R extends string | number
    ? R
    : undefined;

type Union<L extends unknown | undefined, R extends unknown | undefined> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
    ? L
    : L | R;

export type NestedPaths<
  T extends GenericObject,
  Prev extends Primitive | undefined = undefined,
  Path extends Primitive | undefined = undefined,
> = {
  [K in keyof T]: T[K] extends GenericObject
    ? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
    : Union<Union<Prev, Path>, Join<Path, K>>;
}[keyof T];

export type TypeFromPath<
  T extends GenericObject,
  Path extends Primitive, // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
      ? T[P] extends GenericObject
        ? TypeFromPath<T[P], S>
        : never
      : never;
}[Path];

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Undefinable<T> = {
  [P in keyof T]: T[P] | undefined;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;
