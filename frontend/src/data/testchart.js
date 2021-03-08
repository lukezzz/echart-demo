import useSWR from "swr";
import { fetcher } from '../config/fetcher'


export const useFetch = (url) => {
    const { data, error } = useSWR(`/chart/line/${url}`, fetcher);

    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
    };
}

