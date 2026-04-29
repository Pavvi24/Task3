import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, variant = 'default' }) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  if (variant === 'featured') {
    return (
      <article className="card group animate-fade-in">
        {post.coverImage && (
          <div className="overflow-hidden aspect-[16/7]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-8 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <Link to={`/posts/${post._id}`}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink-900 leading-tight mb-4 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="font-body text-ink-600 text-base leading-relaxed mb-6 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                className="w-9 h-9 rounded-full border border-ink-200 object-cover"
              />
              <div>
                <p className="font-sans text-sm font-medium text-ink-800">{post.author?.name}</p>
                <p className="font-sans text-xs text-ink-400">{timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-ink-400">
              <span className="flex items-center gap-1 font-sans text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {post.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1 font-sans text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {post.commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card p-6 group animate-fade-in hover:shadow-md">
      <div className="flex gap-4">
        {post.coverImage && (
          <div className="flex-shrink-0 w-24 h-24 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="tag text-[10px]">{tag}</span>
            ))}
          </div>
          <Link to={`/posts/${post._id}`}>
            <h3 className="font-display text-xl font-bold text-ink-900 leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="font-body text-ink-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                className="w-6 h-6 rounded-full border border-ink-200"
              />
              <span className="font-sans text-xs text-ink-500">{post.author?.name}</span>
              <span className="text-ink-200">·</span>
              <span className="font-sans text-xs text-ink-400">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-3 text-ink-300">
              <span className="font-sans text-xs">{post.likes?.length || 0} ♥</span>
              <span className="font-sans text-xs">{post.commentCount || 0} 💬</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
