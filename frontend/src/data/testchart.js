import useSWR from "swr";
import { fetcher } from '../config/fetcher'

const useBar = (chartType) => {
    console.log(chartType)
    const { data, error } = useSWR(`/chart/basic/${chartType}`, fetcher);

    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
    };
}

export default useBar;