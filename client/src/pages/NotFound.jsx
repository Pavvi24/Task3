import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <p className="font-display text-9xl font-bold text-ink-100 select-none">404</p>
        <h1 className="font-display text-3xl font-bold text-ink-900 -mt-6 mb-3">Page Not Found</h1>
        <p className="font-body text-ink-500 mb-8">The story you're looking for doesn't exist here.</p>
        <Link to="/" className="btn-primary text-xs tracking-widest uppercase">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
