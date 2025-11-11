import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../config";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${config.BASE_URL.replace(/\/+$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  useEffect(() => {
    const f = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error(err);
      }
    };
    f();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>{blog.title}</h2>
      <p>{blog.description}</p>
      {blog.image && <img src={getImageUrl(blog.image)} style={{ maxWidth: "100%" }} alt="" />}
      <p>
        <em>By: {blog.user?.name || "Unknown"}</em>
      </p>
    </div>
  );
};

export default BlogDetail;