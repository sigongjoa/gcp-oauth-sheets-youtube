import React, { useState, useEffect } from 'react';
import youtubeService from '../services/youtubeService';
import { useAuth } from '../context/AuthContext';

function YouTubePage() {
  const { isAuthenticated, login, user } = useAuth();
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
  const [videoAnalyticsData, setVideoAnalyticsData] = useState<any | null>(null);

  // State for comments
  const [comments, setComments] = useState<any[]>([]);
  const [selectedVideoIdForComments, setSelectedVideoIdForComments] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<any | null>(null);

  const requiredScope = 'https://www.googleapis.com/auth/youtube.force-ssl';

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    } else {
      setMessage('Please log in with YouTube access.');
      login(['youtube']);
    }
  }, [isAuthenticated, login]);

  const fetchVideos = async () => {
    try {
      setMessage('Fetching videos...');
      const fetchedVideos = await youtubeService.listVideos(true);
      setVideos(fetchedVideos);
      setMessage('Videos loaded.');
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      setMessage(`Failed to fetch videos: ${error.response?.data || error.message}`);
      if (error.response && error.response.status === 403) {
        setMessage('Insufficient YouTube scope. Please re-authenticate.');
        login(['youtube']);
      }
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedVideoFile(event.target.files[0]);
      setUploadTitle(event.target.files[0].name.split('.')[0]);
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
      fetchVideos();
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
      fetchVideos();
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
        fetchVideos();
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
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const analyticsMetrics = await youtubeService.getVideoAnalyticsMetrics(videoId, startDate, endDate);
      setSelectedVideoForAnalysis(analysisData);
      setVideoAnalyticsData(analyticsMetrics);
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
    setVideoAnalyticsData(null);
  };

  const handleShowComments = async (videoId: string) => {
    if (selectedVideoIdForComments === videoId) {
      setSelectedVideoIdForComments(null); // Hide if already showing
      setComments([]);
      return;
    }
    try {
      setMessage(`Fetching comments for ${videoId}...`);
      const fetchedComments = await youtubeService.getComments(videoId);
      setComments(fetchedComments);
      setSelectedVideoIdForComments(videoId);
      setMessage('Comments loaded.');
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      setMessage(`Failed to fetch comments: ${error.response?.data || error.message}`);
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingComment({
      id: comment.id,
      text: comment.snippet.topLevelComment.snippet.textOriginal,
    });
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  const handleSaveComment = async () => {
    if (!editingComment) return;
    try {
      setMessage('Updating comment...');
      await youtubeService.updateComment(editingComment.id, editingComment.text);
      setEditingComment(null);
      setMessage('Comment updated successfully.');
      handleShowComments(selectedVideoIdForComments!); // Refresh comments
    } catch (error: any) {
      console.error('Error updating comment:', error);
      setMessage(`Failed to update comment: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h1>YouTube Integration</h1>
      <p>{message}</p>

      {isAuthenticated && (
        <>
          {/* ... existing upload and video list UI ... */}
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
                      <button onClick={() => handleShowComments(video.id.videoId || video.id)}>
                        {selectedVideoIdForComments === (video.id.videoId || video.id) ? 'Hide Comments' : 'Show Comments'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ... existing update video form ... */}

          {/* Comments Section */}
          {selectedVideoIdForComments && (
            <div style={{ marginTop: '2rem' }}>
              <h2>Comments for Video ID: {selectedVideoIdForComments}</h2>
              {comments.length > 0 ? (
                comments.map((commentThread) => {
                  const comment = commentThread.snippet.topLevelComment;
                  const isOwnComment = user && user.channelId === comment.snippet.authorChannelId.value;

                  return (
                    <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '8px' }}>
                      <p>
                        <strong>{comment.snippet.authorDisplayName}</strong>
                        <small style={{ marginLeft: '10px' }}>{new Date(comment.snippet.publishedAt).toLocaleString()}</small>
                      </p>
                      {editingComment && editingComment.id === comment.id ? (
                        <div>
                          <textarea
                            style={{ width: '100%', minHeight: '80px' }}
                            value={editingComment.text}
                            onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                          />
                          <button onClick={handleSaveComment}>Save</button>
                          <button onClick={handleCancelEdit} style={{ marginLeft: '5px' }}>Cancel</button>
                        </div>
                      ) : (
                        <p>{comment.snippet.textDisplay}</p>
                      )}
                      {isOwnComment && !editingComment && (
                        <button onClick={() => handleEditComment(comment)}>Edit</button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No comments found for this video.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* ... existing analysis modal ... */}
    </div>
  );
}

export default YouTubePage;
