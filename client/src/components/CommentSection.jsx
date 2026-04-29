import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function CommentItem({ comment, onDelete, postId, onReply }) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        content: replyText.trim(),
        parentComment: comment._id,
      });
      onReply(comment._id, data);
      setReplyText('');
      setShowReplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex gap-3">
        <img
          src={comment.author?.avatar}
          alt={comment.author?.name}
          className="w-8 h-8 rounded-full border border-ink-200 flex-shrink-0 mt-1"
        />
        <div className="flex-1">
          <div className="bg-paper-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-sm font-medium text-ink-900">{comment.author?.name}</span>
              <span className="text-ink-200">·</span>
              <span className="font-sans text-xs text-ink-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="font-body text-sm text-ink-700 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1.5 px-1">
            {user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="font-sans text-xs text-ink-400 hover:text-ink-700 transition-colors"
              >
                Reply
              </button>
            )}
            {user && user._id === comment.author?._id && (
              <button
                onClick={() => onDelete(comment._id)}
                className="font-sans text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>

          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="input text-sm flex-1"
                maxLength={500}
              />
              <button type="submit" disabled={submitting} className="btn-primary text-xs px-4">
                {submitting ? '...' : 'Reply'}
              </button>
            </form>
          )}

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 ml-4 space-y-3 border-l-2 border-ink-100 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex gap-2">
                  <img
                    src={reply.author?.avatar}
                    alt={reply.author?.name}
                    className="w-6 h-6 rounded-full border border-ink-200 flex-shrink-0 mt-1"
                  />
                  <div className="flex-1">
                    <div className="bg-paper-100 border border-ink-100 px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-xs font-medium text-ink-900">{reply.author?.name}</span>
                        <span className="text-ink-200">·</span>
                        <span className="font-sans text-xs text-ink-400">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="font-body text-xs text-ink-700 leading-relaxed">{reply.content}</p>
                    </div>
                    {user && user._id === reply.author?._id && (
                      <button
                        onClick={() => onDelete(reply._id, true)}
                        className="font-sans text-xs text-red-400 hover:text-red-600 mt-1 ml-1 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/comments/${postId}`);
        setComments(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/comments/${postId}`, { content: newComment.trim() });
      setComments((prev) => [data, ...prev]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId, isReply = false) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/comments/${commentId}`);
      if (isReply) {
        setComments((prev) =>
          prev.map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r._id !== commentId),
          }))
        );
      } else {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleReply = (parentId, newReply) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === parentId ? { ...c, replies: [...(c.replies || []), newReply] } : c
      )
    );
    toast.success('Reply posted!');
  };

  return (
    <section className="mt-12 pt-10 border-t border-ink-100">
      <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">
        Discussion <span className="text-ink-300 font-normal">({comments.length})</span>
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full border border-ink-200 flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                maxLength={1000}
                className="input resize-none mb-2"
              />
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs text-ink-400">{newComment.length}/1000</span>
                <button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary text-xs">
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 border border-ink-100 bg-paper-200 text-center">
          <p className="font-body text-sm text-ink-600 mb-3">Join the conversation</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-secondary text-xs">Sign In</Link>
            <Link to="/register" className="btn-primary text-xs">Create Account</Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-ink-200 border-t-accent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-ink-400">
          <p className="font-body text-lg mb-1">No comments yet</p>
          <p className="font-sans text-sm">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </section>
  );
}
