import React, { useState, useEffect } from 'react';
import youtubeService from '../services/youtubeService';
import { useAuth } from '../context/AuthContext';

function YouTubePage() {
  const { isAuthenticated, login } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [privacyStatus, setPrivacyStatus] = useState<string>('private');
  const [message, setMessage] = useState<string>('');
  const [videoIdToUpdate, setVideoIdToUpdate] = useState<string>('');
  const [updateTitle, setUpdateTitle] = useState<string>('');
  const [updateDescription, setUpdateDescription] = useState<string>('');
  const [updatePrivacyStatus, setUpdatePrivacyStatus] = useState<string>('private');

  // State for video analysis modal
  const [selectedVideoForAnalysis, setSelectedVideoForAnalysis] = useState<any | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);

  const requiredScope = 'youtube'; // Corresponds to https://www.googleapis.com/auth/youtube

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    } else {
      setMessage('Please log in with YouTube access.');
      login([requiredScope]);
    }
  }, [isAuthenticated, login]);

  const fetchVideos = async () => {
    try {
      setMessage('Fetching videos...');
      const fetchedVideos = await youtubeService.listVideos(true); // mine=true
      setVideos(fetchedVideos);
      setMessage('Videos loaded.');
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      setMessage(`Failed to fetch videos: ${error.response?.data || error.message}`);
      if (error.response && error.response.status === 403) {
        setMessage('Insufficient YouTube scope. Please re-authenticate.');
        login([requiredScope]);
      }
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedVideoFile(event.target.files[0]);
      setUploadTitle(event.target.files[0].name.split('.')[0]); // Default title
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedVideoFile || !uploadTitle || !uploadDescription || !privacyStatus) {
      setMessage('Please fill all upload fields.');
      return;
    }
    try {
      setMessage('Uploading video...');
      const uploadedVideo = await youtubeService.uploadVideo(
        selectedVideoFile,
        uploadTitle,
        uploadDescription,
        privacyStatus
      );
      setMessage(`Video uploaded: ${uploadedVideo.snippet.title} (ID: ${uploadedVideo.id})`);
      fetchVideos(); // Refresh list
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setMessage(`Failed to upload video: ${error.response?.data || error.message}`);
    }
  };

  const handleUpdateVideo = async () => {
    if (!videoIdToUpdate || !updateTitle || !updateDescription || !updatePrivacyStatus) {
      setMessage('Please fill all update fields.');
      return;
    }
    try {
      setMessage('Updating video...');
      const updatedVideo = await youtubeService.updateVideo(
        videoIdToUpdate,
        updateTitle,
        updateDescription,
        updatePrivacyStatus
      );
      setMessage(`Video updated: ${updatedVideo.snippet.title} (ID: ${updatedVideo.id})`);
      fetchVideos(); // Refresh list
    } catch (error: any) {
      console.error('Error updating video:', error);
      setMessage(`Failed to update video: ${error.response?.data || error.message}`);
    }
  };

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    if (window.confirm(`Are you sure you want to delete ${videoTitle}?`)) {
      try {
        setMessage(`Deleting ${videoTitle}...`);
        await youtubeService.deleteVideo(videoId);
        setMessage(`${videoTitle} deleted.`);
        fetchVideos(); // Refresh list
      } catch (error: any) {
        console.error('Error deleting video:', error);
        setMessage(`Failed to delete ${videoTitle}: ${error.response?.data || error.message}`);
      }
    }
  };

  const handleAnalyzeVideo = async (videoId: string) => {
    try {
      setMessage('Fetching video analysis...');
      const analysisData = await youtubeService.getVideoAnalysis(videoId);
      setSelectedVideoForAnalysis(analysisData);
      setIsAnalysisModalOpen(true);
      setMessage('Video analysis loaded.');
    } catch (error: any) {
      console.error('Error fetching video analysis:', error);
      setMessage(`Failed to fetch video analysis: ${error.response?.data || error.message}`);
    }
  };

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    setSelectedVideoForAnalysis(null);
  };

  return (
    <div>
      <h1>YouTube Integration</h1>
      <p>{message}</p>

      {isAuthenticated && (
        <>
          <h2>Upload Video</h2>
          <div>
            <label>Video File:</label>
            <input type="file" accept="video/*" onChange={handleVideoFileChange} />
          </div>
          <div>
            <label>Title:</label>
            <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label>Privacy Status:</label>
            <select value={privacyStatus} onChange={(e) => setPrivacyStatus(e.target.value)}>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>
          <button onClick={handleUploadVideo} disabled={!selectedVideoFile || !uploadTitle || !uploadDescription}>Upload Video</button>

          <h2>Your Videos</h2>
          {videos.length === 0 ? (
            <p>No videos found or still loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id.videoId || video.id}>
                    <td>{video.snippet.title}</td>
                    <td>{video.id.videoId || video.id}</td>
                    <td>{video.status?.privacyStatus || 'N/A'}</td>
                    <td>
                      <button onClick={() => {
                        setVideoIdToUpdate(video.id.videoId || video.id);
                        setUpdateTitle(video.snippet.title);
                        setUpdateDescription(video.snippet.description);
                        setUpdatePrivacyStatus(video.status?.privacyStatus || 'private');
                      }}>Edit</button>
                      <button onClick={() => handleDeleteVideo(video.id.videoId || video.id, video.snippet.title)}>Delete</button>
                      <button onClick={() => handleAnalyzeVideo(video.id.videoId || video.id)}>Analyze</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {videoIdToUpdate && (
            <>
              <h2>Update Video (ID: {videoIdToUpdate})</h2>
              <div>
                <label>Title:</label>
                <input type="text" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
              </div>
              <div>
                <label>Description:</label>
                <textarea value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}></textarea>
              </div>
              <div>
                <label>Privacy Status:</label>
                <select value={updatePrivacyStatus} onChange={(e) => setUpdatePrivacyStatus(e.target.value)}>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <button onClick={handleUpdateVideo}>Update Video</button>
            </>
          )}
        </>
      )}

      {/* Video Analysis Modal */}
      {isAnalysisModalOpen && selectedVideoForAnalysis && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px',
            maxHeight: '80%',
            overflowY: 'auto',
            color: 'black' // Ensure text is visible on white background
          }}>
            <h2>Video Analysis: {selectedVideoForAnalysis.snippet.title}</h2>
            <p><strong>Description:</strong> {selectedVideoForAnalysis.snippet.description}</p>
            <p><strong>Published At:</strong> {new Date(selectedVideoForAnalysis.snippet.publishedAt).toLocaleString()}</p>
            <p><strong>Views:</strong> {selectedVideoForAnalysis.statistics?.viewCount || 'N/A'}</p>
            <p><strong>Likes:</strong> {selectedVideoForAnalysis.statistics?.likeCount || 'N/A'}</p>
            <p><strong>Comments:</strong> {selectedVideoForAnalysis.statistics?.commentCount || 'N/A'}</p>
            <p><strong>Privacy Status:</strong> {selectedVideoForAnalysis.status?.privacyStatus || 'N/A'}</p>
            <p><strong>Tags:</strong> {selectedVideoForAnalysis.snippet.tags?.join(', ') || 'N/A'}</p>
            <button onClick={handleCloseAnalysisModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubePage;