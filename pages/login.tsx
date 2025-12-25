import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      setMsg('Login successful!');
      // Save token/user in localStorage or context as needed
      // localStorage.setItem('token', res.data.token);
    } catch (err: any) {
      setMsg(err.response?.data?.msg || 'Login error.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
