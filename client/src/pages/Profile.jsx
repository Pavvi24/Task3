import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { format } from 'date-fns';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, bio: user.bio || '', password: '' });
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`/posts/user/${user._id}`);
        setPosts(data);
      } catch {
        // silent
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = { name: form.name, bio: form.bio };
      if (form.password) updates.password = form.password;
      await updateProfile(updates);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-20 h-20 rounded-full border-2 border-ink-200"
          />
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-1.5">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" maxLength={50} />
                </div>
                <div>
                  <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-1.5">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="input resize-none" maxLength={200} />
                </div>
                <div>
                  <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-1.5">
                    New Password <span className="text-ink-400 normal-case tracking-normal font-normal">(leave blank to keep current)</span>
                  </label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" className="input" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="btn-primary text-xs">{saving ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-xs">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold text-ink-900 mb-1">{user?.name}</h1>
                <p className="font-sans text-sm text-ink-400 mb-3">{user?.email}</p>
                {user?.bio && <p className="font-body text-ink-600 text-sm mb-4">{user.bio}</p>}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-ink-900">{posts.length}</div>
                    <div className="font-sans text-xs text-ink-400 uppercase tracking-wide">Posts</div>
                  </div>
                  <div className="h-8 w-px bg-ink-100" />
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-ink-900">
                      {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
                    </div>
                    <div className="font-sans text-xs text-ink-400 uppercase tracking-wide">Likes</div>
                  </div>
                  <div className="h-8 w-px bg-ink-100" />
                  <div className="text-center">
                    <div className="font-display text-xs font-bold text-ink-600">
                      {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : '—'}
                    </div>
                    <div className="font-sans text-xs text-ink-400 uppercase tracking-wide">Joined</div>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="btn-secondary text-xs mt-4">
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-ink-900">My Posts</h2>
          <Link to="/create" className="btn-primary text-xs">+ New Post</Link>
        </div>

        {loadingPosts ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-ink-200 border-t-accent rounded-full animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-ink-200">
            <p className="font-body text-ink-400 mb-4">You haven't written anything yet.</p>
            <Link to="/create" className="btn-primary text-xs">Write your first post</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="relative">
                <PostCard post={post} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link to={`/edit/${post._id}`} className="bg-paper-50 border border-ink-200 px-3 py-1 font-sans text-xs text-ink-600 hover:border-ink-900 transition-colors">
                    Edit
                  </Link>
                  <button onClick={() => handleDeletePost(post._id)} className="bg-red-50 border border-red-200 px-3 py-1 font-sans text-xs text-red-600 hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
