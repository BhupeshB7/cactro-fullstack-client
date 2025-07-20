// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://localhost:5000/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Video API calls
export const getVideoDetails = async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
};

export const updateVideo = async (videoId, data) => {
    const response = await api.put(`/videos/${videoId}`, data);
    return response.data;
};

// Comment API calls
export const getComments = async (videoId) => {
    const response = await api.get(`/comments/${videoId}`);
    return response.data;
};

export const addComment = async (videoId, data) => {
    const response = await api.post(`/comments/${videoId}`, data);
    return response.data;
};

export const replyToComment = async (videoId, commentId, data) => {
    const response = await api.post(`/comments/${videoId}/reply/${commentId}`, data);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
};

// Note API calls
export const getNotes = async (videoId) => {
    const response = await api.get(`/notes/${videoId}`);
    return response.data;
};

export const addOrUpdateNote = async (videoId, data) => {
    const response = await api.post(`/notes/${videoId}`, data);
    return response.data;
};

export const deleteNote = async (videoId) => {
    const response = await api.delete(`/notes/${videoId}`);
    return response.data;
};