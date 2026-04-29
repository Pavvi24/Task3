import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    coverImage: '',
    tags: '',
    published: true,
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const { data } = await axios.post('/posts', {
        title: form.title,
        content: form.content,
        coverImage: form.coverImage,
        tags,
        published: form.published,
      });

      toast.success('Post published! 🎉');
      navigate(`/posts/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <div className="h-px w-10 bg-accent mb-5" />
        <h1 className="font-display text-4xl font-bold text-ink-900">Write a Post</h1>
        <p className="font-body text-ink-500 mt-2">Share your ideas with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="An Interesting Title..."
            required
            maxLength={150}
            className="input text-lg font-display"
          />
        </div>

        {/* Cover image URL */}
        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">
            Cover Image URL <span className="text-ink-400 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <input
            type="url"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="input"
          />
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="mt-3 w-full h-40 object-cover border border-ink-100"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest mb-2">
            Tags <span className="text-ink-400 normal-case tracking-normal font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="technology, design, tips"
            className="input"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-sans text-xs font-medium text-ink-700 uppercase tracking-widest">
              Content * <span className="text-ink-400 normal-case tracking-normal font-normal">(Markdown supported)</span>
            </label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="font-sans text-xs text-ink-500 hover:text-ink-900 border border-ink-200 px-3 py-1 transition-colors"
            >
              {preview ? '✏️ Edit' : '👁 Preview'}
            </button>
          </div>

          {preview ? (
            <div className="prose-blog border border-ink-100 bg-paper-50 p-6 min-h-64">
              {form.content ? (
                <div dangerouslySetInnerHTML={{
                  __html: form.content
                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                }} />
              ) : (
                <p className="text-ink-400 italic">Nothing to preview yet...</p>
              )}
            </div>
          ) : (
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder={`# Your Post Title\n\nStart writing your post here...\n\nYou can use **Markdown** for formatting:\n- Lists\n- **Bold** and *italic*\n- \`code\`\n\n## Section Heading\n\nYour content goes here.`}
              required
              rows={20}
              className="input font-mono text-sm resize-y"
            />
          )}
          <p className="font-sans text-xs text-ink-400 mt-1.5">{form.content.length} characters</p>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3 p-4 bg-paper-200 border border-ink-100">
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={form.published}
            onChange={handleChange}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="published" className="font-sans text-sm text-ink-700 cursor-pointer">
            Publish immediately
            <span className="text-ink-400 ml-1">(uncheck to save as draft)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-3 text-xs tracking-widest uppercase"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-paper-300 border-t-paper-50 rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              form.published ? '🚀 Publish Post' : '💾 Save Draft'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary px-8"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
