import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../config";

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({ title: "", description: "", image: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
        setBlog(res.data.blog || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) =>
    setBlog({ ...blog, [e.target.name]: e.target.value });
  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("title", blog.title);
    form.append("description", blog.description);
    if (file) form.append("image", file);
    try {
      await axios.put(`${config.BASE_URL}/api/blogs/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Updated successfully!");
      window.location.href = "/myblogs";
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${config.BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Edit Blog</h2>

      <input
        name="title"
        placeholder="Title"
        value={blog.title || ""}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={blog.description || ""}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      {blog.image && (
        <div>
          <img
            src={getImageSrc(blog.image)}
            alt="preview"
            style={{ maxWidth: "100%", marginBottom: 8 }}
          />
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFile} />

      <button type="submit" style={{ marginTop: 10 }}>
        Save
      </button>
    </form>
  );
};

export default EditBlog;