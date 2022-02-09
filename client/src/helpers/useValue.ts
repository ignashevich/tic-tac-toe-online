import { Dispatch, SetStateAction, useState } from 'react';

export type IEditable<T> = { get: () => T; set: Dispatch<SetStateAction<T>> }

export const useValue = <T = undefined>(defaultValue?: T | (() => T)) => {
    const [value, set] = useState<T>(defaultValue);

    return ({get: () => value, set}) as IEditable<T>;
}
