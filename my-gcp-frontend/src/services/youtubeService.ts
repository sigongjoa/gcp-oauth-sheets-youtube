import api from './api';

const youtubeService = {
  listVideos: async (mine: boolean = true, part: string = 'snippet', maxResults: number = 10) => {
    const response = await api.get('/api/youtube/videos', {
      params: {
        mine: mine ? 'true' : 'false',
        part,
        maxResults,
      },
    });
    return response.data;
  },

  uploadVideo: async (videoFile: File, title: string, description: string, privacyStatus: string) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('privacyStatus', privacyStatus);

    const response = await api.post('/api/youtube/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateVideo: async (videoId: string, title: string, description: string, privacyStatus: string) => {
    const response = await api.put(`/api/youtube/videos/${videoId}`, {
      title,
      description,
      privacyStatus,
    });
    return response.data;
  },

  deleteVideo: async (videoId: string) => {
    const response = await api.delete(`/api/youtube/videos/${videoId}`);
    return response.data;
  },
};

export default youtubeService;
