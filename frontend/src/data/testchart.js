import useSWR from "swr";
import { fetcher } from '../config/fetcher'


export const useFetch = (chartType) => {
    const { data, error } = useSWR(`/chart/${chartType}`, fetcher);

    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
    };
}

