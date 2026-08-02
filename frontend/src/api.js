import axios from 'axios';

// استخدم الرابط الثابت (بدون متغير بيئي)
const API_URL = 'https://mern-website-builder.onrender.com/api';

const API = axios.create({ baseURL: API_URL });

export const getProject = () => API.get('/project');
export const updateProject = (data) => API.put('/project', data);
export const publishProject = () => API.put('/project/publish');
export const unpublishProject = () => API.put('/project/unpublish');

export default API;