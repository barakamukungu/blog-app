import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs`);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            image={blog.image}
            isUser={localStorage.getItem("userId") === blog.user?._id}
            user={blog.user}
          />
        ))
      ) : (
        <p>No blogs yet. Add one!</p>
      )}
    </div>
  );
};

export default Blogs;