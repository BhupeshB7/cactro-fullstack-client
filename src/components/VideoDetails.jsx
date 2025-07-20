import React from 'react';
import { Eye, Calendar, User } from 'lucide-react';

const VideoDetails = ({ video }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{video.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <User size={16} />
            <span>{video.channelTitle}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye size={16} />
            <span>{video.views?.toLocaleString()} views</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
            {video.description || 'No description available'}
          </p>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Video Preview</h3>
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;