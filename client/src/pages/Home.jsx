import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API}/api/posts`);

        // handle both formats:
        // 1. [ ... ]
        // 2. { posts: [...] }
        const data = res.data;

        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data.posts) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }

      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🟡 Loading state
  if (loading) {
    return <div style={{ padding: "20px" }}>Loading posts...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Posts</h1>

      {/* 🟡 Empty state */}
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
       posts.map((post) => (
  <PostCard key={post._id} post={post} />
))
      )}
    </div>
  );
};

export default Home;
