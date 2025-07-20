import React, { useState, useEffect } from 'react';
import { MessageCircle, Reply, Trash2, Send } from 'lucide-react';
import * as api from '../services/api';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const data = await api.getComments(videoId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      await api.addComment(videoId, { text: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;

    try {
      await api.replyToComment(videoId, commentId, { text });
      setReplyText({ ...replyText, [commentId]: '' });
      setShowReply({ ...showReply, [commentId]: false });
      fetchComments();
    } catch (error) {
      alert('Failed to add reply');
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  const parentComments = comments.filter(c => !c.isReply);
  const replies = comments.filter(c => c.isReply);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Comments</h2>

      {/* Add Comment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          onClick={addComment}
          disabled={loading || !newComment.trim()}
          className="mt-3 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          <Send size={16} />
          <span>{loading ? 'Posting...' : 'Post Comment'}</span>
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {parentComments.map(comment => (
          <div key={comment._id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => deleteComment(comment._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-gray-700 mb-3">{comment.text}</p>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowReply({ ...showReply, [comment._id]: !showReply[comment._id] })}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <Reply size={16} />
                <span>Reply</span>
              </button>
            </div>

            {/* Replies */}
            {replies.filter(r => r.parentId === comment._id).map(reply => (
              <div key={reply._id} className="ml-6 mt-3 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{reply.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(reply.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteComment(reply._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-gray-700">{reply.text}</p>
              </div>
            ))}

            {/* Reply Form */}
            {showReply[comment._id] && (
              <div className="ml-6 mt-3">
                <textarea
                  value={replyText[comment._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => addReply(comment._id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setShowReply({ ...showReply, [comment._id]: false })}
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-2" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;