import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const verifyCPF = async (cpf: string) => {
    const response = await axios.post(`${API_BASE_URL}/verify-cpf`, { cpf });
    return response.data;
};

export const confirmUser = async (cpf: string) => {
    const response1 = await axios.post(`${API_BASE_URL}/confirm-user`, { cpf }, {
        responseType: 'blob'
    });

    const response2 = await axios.post(`${API_BASE_URL}/download-second-file`, { cpf }, {
        responseType: 'blob'
    });

    return { response1, response2 };
};

export const savePhone = async (cpf: string, phone: string) => {
    await axios.post(`${API_BASE_URL}/save-phone`, { cpf, phone });
};
