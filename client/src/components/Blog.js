import React from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const Blog = ({ id, title, description, image, isUser, user }) => {
  const navigate = useNavigate();

  const handleEdit = () => navigate(`/blogs/edit/${id}`);
  const handleView = () => navigate(`/blogs/${id}`);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.BASE_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const getImageUrl = (img) => {
    if (!img) return ""; 
    if (img.startsWith("http")) return img;
     return `${config.BASE_URL.replace(/\/+$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  return (
    <Card className="card" style={{ marginBottom: "20px" }}>
      {image && (
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(image)}
          alt={title}
          style={{ objectFit: "cover" }}
        />
      )}
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        <Typography variant="caption" display="block">
          By: {user?.name || "Unknown"}
        </Typography>

        <div style={{ marginTop: 10, textAlign: "right" }}>
          <Button onClick={handleView}>View</Button>
          {isUser && (
            <>
              <Button onClick={handleEdit}>Edit</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Blog;