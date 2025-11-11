import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Blogs from './components/Blogs';
import AddBlog from './components/AddBlogs';
import EditBlog from './components/EditBlog';
import UserBlogs from './components/UserBlogs';
import BlogDetail from './components/BlogDetail';
import Login from './components/Login';
import Signup from './components/Signup';

const App = ()=>{
  const navigate = useNavigate();
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  useEffect(()=>{
    setAuth(!!localStorage.getItem('token'));
  },[]);

  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <strong>My Blog</strong>
        </div>
        <div style={{marginRight:20}}>
          <Link to="/blogs">Blogs</Link>
          {auth ? <><Link to="/blogs/add" style={{marginLeft:12}}>Add</Link><Link to="/myblogs" style={{marginLeft:12}}>My Blogs</Link><button onClick={logout} style={{marginLeft:12}}>Logout</button></> : <><Link to="/login" style={{marginLeft:12}}>Login</Link><Link to="/signup" style={{marginLeft:12}}>Signup</Link></> }
        </div>
      </header>
      <main className="container" style={{marginTop:20}}>
        <Routes>
          <Route path="/" element={<Navigate to="/blogs" />} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/blogs/add" element={<AddBlog/>} />
          <Route path="/blogs/edit/:id" element={<EditBlog/>} />
          <Route path="/blogs/:id" element={<BlogDetail/>} />
          <Route path="/myblogs" element={<UserBlogs/>} />
          <Route path="/login" element={<Login onAuth={()=>setAuth(true)}/>} />
          <Route path="/signup" element={<Signup onAuth={()=>setAuth(true)}/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;