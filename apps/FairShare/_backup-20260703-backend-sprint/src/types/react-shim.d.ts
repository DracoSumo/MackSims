declare module "react" {
  export type ReactNode = unknown;

  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];

  export const StrictMode: (props: { children?: unknown }) => unknown;

  const React: {
    StrictMode: (props: { children?: unknown }) => unknown;
  };

  export default React;
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: unknown): void;
  };
}

declare module "react/jsx-runtime" {
  export const Fragment: unknown;
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
}

declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number;
  }

  interface IntrinsicElements {
    [elementName: string]: unknown;
  }
}
