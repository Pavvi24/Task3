import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '', content: '', coverImage: '', tags: '', published: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        if (data.author._id !== user?._id) {
          toast.error('Not authorized to edit this post');
          navigate('/');
          return;
        }
        setForm({
          title: data.title,
          content: data.content,
          coverImage: data.coverImage || '',
          tags: data.tags?.join(', ') || '',
          published: data.published,
        });
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPost();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await axios.put(`/posts/${id}`, { ...form, tags });
      toast.success('Post updated!');
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <div className="h-px w-10 bg-accent mb-5" />
        <h1 className="font-display text-4xl font-bold text-ink-900">Edit Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required maxLength={150} className="input text-lg font-display" />
        </div>

        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">Cover Image URL</label>
          <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange} className="input" />
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover" className="mt-3 w-full h-40 object-cover border border-ink-100" onError={(e) => (e.target.style.display = 'none')} />
          )}
        </div>

        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">Tags</label>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="technology, design" className="input" />
        </div>

        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">Content *</label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={20} className="input font-mono text-sm resize-y" />
        </div>

        <div className="flex items-center gap-3 p-4 bg-paper-200 border border-ink-100">
          <input type="checkbox" name="published" id="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-accent" />
          <label htmlFor="published" className="font-sans text-sm text-ink-700 cursor-pointer">Published</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-xs tracking-widest uppercase">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(`/posts/${id}`)} className="btn-secondary px-8">Cancel</button>
        </div>
      </form>
    </div>
  );
}
