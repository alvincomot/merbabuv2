import axios from 'axios';

const api = axios.create({
    baseURL: 'mysql://uc84hzvxlvdf1wqt:Dn9zpoGWHXJG5f3xDMIY@bvtdrb6rxsnlusu0bkb6-mysql.services.clever-cloud.com:3306/bvtdrb6rxsnlusu0bkb6',
    withCredentials: true
});

export default api;