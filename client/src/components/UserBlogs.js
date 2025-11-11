import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${config.BASE_URL.replace(/\/+$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  useEffect(() => {
    const f = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/user/${userId}`);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) f();
  }, [userId]);

  const handleEdit = (id) => navigate(`/blogs/edit/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.BASE_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>My Blogs</h2>
      {blogs.map((b) => (
        <div key={b._id} className="card">
          <h3>{b.title}</h3>
          <p>{b.description}</p>
          {b.image && <img src={getImageUrl(b.image)} style={{ maxWidth: "100%" }} alt="" />}
          <div style={{ textAlign: "right" }}>
            <button onClick={() => handleEdit(b._id)}>Edit</button>
            <button onClick={() => handleDelete(b._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBlogs;