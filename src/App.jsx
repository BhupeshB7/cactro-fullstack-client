import React, { useState, useEffect, useCallback } from 'react';
import { Play, Edit, MessageCircle, FileText, Sun, Moon } from 'lucide-react';
import VideoDetails from './components/VideoDetails';
import Comments from './components/Comments';
import VideoEditor from './components/VideoEditor';
import Notes from './components/Notes';
import * as api from './services/api';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Toast = ({ msg, onDismiss }) => (
  <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-white shadow-xl animate-slide-in">
    <span>{msg}</span>
    <button onClick={onDismiss} className="text-sm font-bold">
      ✕
    </button>
  </div>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-gray-300 ${className}`} />
);

function App() {
  const [videoId, setVideoId] = useState('');
  const [video, setVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const fetchVideo = useCallback(async () => {
    if (!videoId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getVideoDetails(videoId);
      await sleep(600);
      setVideo(data);
    } catch (e) {
      setError('Failed to fetch video details. Check the ID and try again.');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  const tabs = [
    { id: 'details', label: 'Details', icon: Play },
    { id: 'edit', label: 'Edit', icon: Edit },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans transition-colors dark:from-slate-900 dark:to-slate-800">
      {error && <Toast msg={error} onDismiss={() => setError(null)} />}

      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-4xl font-extrabold text-transparent">
            YouTube Companion
          </h1> 
        </header>

        <div className="group relative mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Paste your YouTube Video ID  (e.g. dQw4w9WgXcQ)"
              aria-busy={loading}
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-4 py-3 text-slate-700 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchVideo()}
            />
            <button
              onClick={fetchVideo}
              disabled={loading || !videoId.trim()}
              className="flex h-12 w-28 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:saturate-150 disabled:from-gray-400 disabled:to-gray-500"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Load'
              )}
            </button>
          </div>
          <p className="mt-2 pl-1 text-xs text-slate-500">
            Upload an unlisted video to YouTube first, then drop its ID here.
          </p>
        </div>

        {loading && (
          <div className="animate-fade-in rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <Skeleton className="mb-4 h-8 w-1/3" />
            <Skeleton className="mb-3 h-5 w-full" />
            <Skeleton className="mb-3 h-5 w-5/6" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {!loading && video && (
          <div className="animate-fade-in rounded-xl bg-white shadow-xl dark:bg-slate-800">
            <nav className="flex gap-2 border-b border-slate-200 px-4 pt-2 dark:border-slate-700">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-t-md border-b-2 px-4 py-3 text-sm font-semibold transition-all
                    ${
                      activeTab === id
                        ? 'border-red-500 text-red-600 dark:border-red-500 dark:text-red-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="p-6">
              {activeTab === 'details' && <VideoDetails video={video} />}
              {activeTab === 'edit' && (
                <VideoEditor
                  video={video}
                  onUpdate={(updated) => setVideo(updated)}
                />
              )}
              {activeTab === 'comments' && <Comments videoId={video.videoId} />}
              {activeTab === 'notes' && <Notes videoId={video.videoId} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;