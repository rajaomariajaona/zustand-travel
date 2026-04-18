import type { StateCreator, StoreMutatorIdentifier, ExtractState } from 'zustand/vanilla';
import { type TravelsOptions, type TravelsControls, type ManualTravelsControls, type PatchesOption } from 'travels';
type Travel = <T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = [], A extends boolean = true>(initializer: StateCreator<T, [...Mps, ['zustand/travel', never]], Mcs>, options?: Omit<TravelsOptions<false, A>, 'mutable'>) => StateCreator<T, Mps, [['zustand/travel', never], ...Mcs]>;
declare module 'zustand/vanilla' {
    interface StoreMutators<S, A> {
        ['zustand/travel']: WithTravel<S>;
    }
}
type Write<T, U> = Omit<T, keyof U> & U;
type WithTravel<S> = Write<S, StoreTravel<S>>;
type SkipTwo<T> = T extends {
    length: 0;
} ? [] : T extends {
    length: 1;
} ? [] : T extends {
    length: 0 | 1;
} ? [] : T extends [unknown, unknown, ...infer A] ? A : T extends [unknown, unknown?, ...infer A] ? A : T extends [unknown?, unknown?, ...infer A] ? A : never;
type SetStateType<T extends unknown[]> = Exclude<T[0], (...args: any[]) => any>;
type FunctionUpdater<T extends unknown[]> = Extract<T[0], (...args: any[]) => any> extends (...args: infer A) => infer R ? (...args: A) => R | void : never;
type StoreTravelSetState<S> = S extends {
    setState: {
        (...args: infer Sa1): infer Sr1;
        (...args: infer Sa2): infer Sr2;
    };
} ? {
    /**
     * Allow mutation-style updates by accepting updater functions that return void.
     */
    setState(nextStateOrUpdater: SetStateType<Sa2> | Partial<SetStateType<Sa2>> | FunctionUpdater<Sa1>, shouldReplace?: false, ...args: SkipTwo<Sa1>): Sr1;
    setState(nextStateOrUpdater: SetStateType<Sa2> | FunctionUpdater<Sa2>, shouldReplace: true, ...args: SkipTwo<Sa2>): Sr2;
} : S extends {
    setState: (...args: infer Sa) => infer Sr;
} ? {
    setState: S['setState'];
} : {};
type StoreTravel<S> = StoreTravelSetState<S> & {
    getControls: <F extends boolean = false, A extends boolean = true>() => A extends true ? TravelsControls<ExtractState<S>, F> : ManualTravelsControls<ExtractState<S>, F>;
};
export type Controls<S, A extends boolean = false, F extends boolean = false, P extends PatchesOption = {}> = A extends true ? TravelsControls<S, F, P> : ManualTravelsControls<S, F, P>;
/**
 * Zustand middleware that adds time-travel capabilities powered by Travels
 *
 * @example
 * ```typescript
 * import { create } from 'zustand';
 * import { travel } from 'zustand-travel';
 *
 * type State = {
 *   count: number;
 * };
 *
 * type Actions = {
 *   increment: (qty: number) => void;
 *   decrement: (qty: number) => void;
 * };
 *
 * const useStore = create<State & Actions>()(
 *   travel((set) => ({
 *     count: 0,
 *     increment: (qty) => set((state) => { state.count += qty }),
 *     decrement: (qty) => set((state) => { state.count -= qty }),
 *   }))
 * );
 *
 * // Access controls
 * const controls = useStore.getControls();
 * controls.back();    // Undo
 * controls.forward(); // Redo
 * controls.reset();   // Reset to initial state
 * ```
 *
 * @param initializer - The state creator function
 * @param options - Travels options (maxHistory, autoArchive, etc.)
 */
export declare const travel: Travel;
/**
 * Re-export types from travels for convenience
 */
export type { TravelsControls, ManualTravelsControls, TravelPatches, } from 'travels';
/**
 * Extend Zustand's StoreApi to include getControls method
 */
declare module 'zustand/vanilla' {
    interface StoreApi<T> {
        /**
         * Get time-travel controls for the store
         *
         * @returns Controls object with undo/redo methods
         *
         * @example
         * ```typescript
         * const controls = useStore.getControls();
         * controls.back();     // Undo
         * controls.forward();  // Redo
         * controls.reset();    // Reset to initial state
         * ```
         */
        getControls?: <F extends boolean = false, A extends boolean = true>() => A extends true ? TravelsControls<T, F> : ManualTravelsControls<T, F>;
    }
}
export default travel;
//# sourceMappingURL=index.d.ts.map