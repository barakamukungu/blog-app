import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Login = ({ onAuth })=>{
  const [inputs, setInputs] = useState({ email:'', password:'' });
  const navigate = useNavigate();

  const handleChange = (e)=> setInputs(prev=>({...prev, [e.target.name]: e.target.value}));
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${config.BASE_URL}/api/users/login`, inputs);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('userName', res.data.user.name);
      if (onAuth) onAuth();
      navigate('/blogs');
    }catch(err){ console.error(err); alert('Login failed'); }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400, margin:'0 auto'}}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required style={{width:'100%',padding:8,marginBottom:8}}/>
      <input name="password" type="password" placeholder="Password" value={inputs.password} onChange={handleChange} required style={{width:'100%',padding:8,marginBottom:8}}/>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;