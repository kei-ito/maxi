import {useState, useEffect} from 'react';

export interface ICacheProps<TValue, TKey> {
    keys: Array<TKey>,
    getter: (key: TKey) => TValue | null | Promise<TValue | null>,
    onError: (error: Error) => void,
    dependencies?: Array<any>,
}

export const useCache = <TValue, TKey = string>(
    props: ICacheProps<TValue, TKey>,
) => {
    const [cache, updateCache] = useState(new Map<TKey, TValue>());
    const [loading, updateLoading] = useState<Array<TKey>>([]);
    const [clearCount, setClearCount] = useState(0);
    useEffect(() => {
        for (const key of props.keys) {
            if (!cache.has(key) && !loading.includes(key)) {
                updateLoading([...loading, key]);
                Promise.resolve(props.getter(key))
                .then((value) => {
                    if (value !== null) {
                        cache.set(key, value);
                        updateCache(new Map(cache));
                    }
                })
                .catch(props.onError)
                .finally(() => {
                    updateLoading(loading.filter((loadingKey) => loadingKey !== key));
                });
            }
        }
    }, [props.keys, clearCount]);
    if (props.dependencies) {
        useEffect(() => {
            cache.clear();
            setClearCount(clearCount + 1);
        }, props.dependencies);
    }
    return cache;
};
