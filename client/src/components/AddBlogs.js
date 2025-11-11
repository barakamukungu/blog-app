import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const AddBlogs = () => {
  const [inputs, setInputs] = useState({ title:'', description:'', imageUrl:'' });
  const [file, setFile] = useState(null);

  const handleChange = (e)=> setInputs(prev=>({...prev, [e.target.name]: e.target.value}));
  const handleFile = (e)=> setFile(e.target.files[0]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('title', inputs.title);
    form.append('description', inputs.description);
    if (file) form.append('image', file);
    else if (inputs.imageUrl) form.append('imageUrl', inputs.imageUrl);
    try {
      const res = await axios.post(`${config.BASE_URL}/api/blogs/add`, form, { headers: { Authorization: `Bearer ${token}`, 'Content-Type':'multipart/form-data' } });
      alert('Added');
      window.location.href = '/blogs';
    } catch (err) {
      console.error('Error adding blog', err);
      alert('Add failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:600, margin:'0 auto'}}>
      <h2>Add Blog</h2>
      <input name="title" placeholder="Title" value={inputs.title} onChange={handleChange} required style={{width:'100%',padding:8,marginBottom:8}}/>
      <textarea name="description" placeholder="Description" value={inputs.description} onChange={handleChange} required style={{width:'100%',padding:8,marginBottom:8}}/>
      <input type="file" accept="image/*" onChange={handleFile} />
      <div>Or paste image URL:</div>
      <input name="imageUrl" placeholder="https://..." value={inputs.imageUrl} onChange={handleChange} style={{width:'100%',padding:8,marginTop:8}}/>
      <button type="submit" style={{marginTop:10}}>Add</button>
    </form>
  );
};

export default AddBlogs;