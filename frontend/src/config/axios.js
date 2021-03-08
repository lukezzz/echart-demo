import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 60000,
});

axiosInstance.interceptors.request.use(
    config => {
        let token = undefined
        if (localStorage.getItem("access_token") !== null) {
            token = JSON.parse(localStorage.getItem("access_token"));
        }
        if (sessionStorage.getItem("access_token") !== null) {
            token = JSON.parse(sessionStorage.getItem("access_token"));
        }

        if (token) {
            config.headers['Authorization'] = `JWT ${token}`;
        }
        return config;

    },
    error => {
        Promise.reject(error)
    });

axiosInstance.interceptors.response.use(response => {
    return response;
}, err => {
    // if refresh token expired, logout user
    return new Promise((resolve, reject) => {
        const originalReq = err.config;
        if (err.response.status === 401 && err.response.data.msg === 'The access token has expired' && err.config && !err.config.__isRetryRequest) {
            originalReq._retry = true;
            console.info('refreshing token')

            let token = undefined
            let remember = true


            if (localStorage.getItem("refresh_token") !== null) {
                token = JSON.parse(localStorage.getItem("refresh_token"));
            }
            if (sessionStorage.getItem("refresh_token") !== null) {
                token = JSON.parse(sessionStorage.getItem("refresh_token"));
                remember = false

            }


            let res = fetch(`${process.env.REACT_APP_BASE_URL}auth/refresh`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': `JWT ${token}`
                },
                redirect: 'follow',
                referrer: 'no-referrer',

            }).then(res => res.json()).then(res => {
                // console.log(res.access_token);
                // this.setSession({ access_token: res.token, refresh_token: res.refresh });

                if (remember) {
                    localStorage.setItem('access_token', JSON.stringify(res.access_token));
                } else {
                    sessionStorage.setItem('access_token', JSON.stringify(res.access_token));
                }

                originalReq.headers['Authorization'] = `JWT ${res.access_token}`;

                return axios(originalReq);
            }).catch(err => Promise.reject(err))


            resolve(res);
        }
        else {
            if (err.response.status === 401) {

            }
        }

        // if (err.response.status === 500) {

        // }

        // if (err.response.status === 422) {

        // }

        // if (err.response.status === 404) {
        //     switch (err.response.statusText) {
        //         case 'NOT FOUND':
        //             break;

        //         default:
        //             break;
        //     }

        // }

        // if (err.response.status === 400 || err.response.status === 403) {
        //     const { request } = err.response
        //     let errorMsg = request.response
        //     throw JSON.parse(errorMsg)
        // }
        throw new Error("An error has occurred!");

        // return Promise.reject(err);
    });
});


export default axiosInstance