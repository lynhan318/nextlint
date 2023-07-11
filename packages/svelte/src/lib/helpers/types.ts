import type {SvelteComponent, ComponentConstructorOptions} from 'svelte';

export type Maybe<T> = T | null | undefined;
export type AnyRecord = Record<string, any>;

export type SvelteComponentConstructor<T extends AnyRecord> = new (
  options: ComponentConstructorOptions<T>
) => SvelteComponent;
