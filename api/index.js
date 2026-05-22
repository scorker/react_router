import axios from 'axios';

let baseUrl;
if(process.env.NODE_ENV === "production") {
    if(typeof window === 'undefined') {
        // Running in server - send to external API
        baseUrl = 'https://api.styler.digital';
    } else {
        // Running in client
        baseUrl = '/api/external';
    }
} else {
    // Running in dev - send to API running locally
    baseUrl = 'http://localhost:8080';
}

const remoteApi = {
    getPlans() { 
        return axios.get(`${baseUrl}/website/plans`);
    },
    getAddons() { 
        return axios.get(`${baseUrl}/website/addons`);
    },
    getPromotion(promoCode) { 
        return axios.get(`${baseUrl}/website/promo_code/${promoCode}`);
    },
    postUserDetails(data) { 
        return axios.post(`${baseUrl}/website/user_details`, data);
    },
    postUserPlan(data) { 
        return axios.post(`${baseUrl}/website/user_plan`, data);
    },
    createPaymentIntent(data) { 
        return axios.post(`${baseUrl}/website/create_payment_intent`, data);
    },
    confirmPaymentIntent(data) { 
        return axios.post(`${baseUrl}/website/confirm_payment_intent`, data);
    }
};

export default remoteApi;