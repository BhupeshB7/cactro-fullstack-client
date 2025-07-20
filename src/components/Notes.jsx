import React, { useState, useEffect } from 'react';
import { FileText, Save, Trash2 } from 'lucide-react';
import * as api from '../services/api';

const Notes = ({ videoId }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [videoId]);

  const fetchNotes = async () => {
    try {
      const data = await api.getNotes(videoId);
      if (data.length > 0) {
        setCurrentNote(data[0].note);
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const saveNote = async () => {
    if (!currentNote.trim()) return;

    setSaving(true);
    try {
      await api.addOrUpdateNote(videoId, { note: currentNote });
      fetchNotes();
      alert('Note saved successfully!');
    } catch (error) {
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.deleteNote(videoId);
      setCurrentNote('');
      setNotes([]);
      alert('Note deleted successfully!');
    } catch (error) {
      alert('Failed to delete note');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Video Improvement Notes</h2>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-800 text-sm mb-3">
          <FileText size={16} className="inline mr-2" />
          Jot down ideas for improving your video content, engagement, or production quality.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Notes
        </label>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Write your video improvement ideas here..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={saveNote}
          disabled={saving || !currentNote.trim()}
          className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Note'}</span>
        </button>
        
        {notes.length > 0 && (
          <button
            onClick={deleteNote}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Trash2 size={18} />
            <span>Delete Note</span>
          </button>
        )}
      </div>

      {notes.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Last updated: {new Date(notes[0].updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notes;