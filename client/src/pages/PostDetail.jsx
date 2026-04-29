import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        if (user) setLiked(data.likes?.includes(user._id));
      } catch (err) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Sign in to like posts'); return; }
    setLiking(true);
    try {
      const { data } = await axios.put(`/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch {
      toast.error('Failed to like post');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
      await axios.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && user._id === post.author?._id;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to="/" className="font-sans text-xs text-ink-400 hover:text-ink-700 tracking-wide transition-colors">
          ← Back to all posts
        </Link>
      </nav>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 leading-tight mb-6">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="w-11 h-11 rounded-full border border-ink-200"
          />
          <div>
            <p className="font-sans text-sm font-medium text-ink-900">{post.author?.name}</p>
            <p className="font-sans text-xs text-ink-400">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link to={`/edit/${post._id}`} className="btn-secondary text-xs">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger text-xs">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose-blog mb-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {/* Like button */}
      <div className="flex items-center justify-center py-6 border-t border-b border-ink-100 mb-10">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-2 px-6 py-3 border transition-all duration-200 font-sans text-sm ${
            liked
              ? 'bg-accent text-white border-accent'
              : 'bg-paper-50 border-ink-200 text-ink-600 hover:border-accent hover:text-accent'
          }`}
        >
          <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </article>
  );
}
