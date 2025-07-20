import React, { useState } from 'react';
import { Save } from 'lucide-react';
import * as api from '../services/api';

const VideoEditor = ({ video, onUpdate }) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedVideo = await api.updateVideo(video.videoId, { title, description });
      onUpdate(updatedVideo);
      alert('Video updated successfully!');
    } catch (error) {
      alert('Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Edit Video</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
      >
        <Save size={18} />
        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
      </button>
    </div>
  );
};

export default VideoEditor;