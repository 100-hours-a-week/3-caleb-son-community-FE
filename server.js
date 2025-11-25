require('dotenv').config();
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3003;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/posts/new', (req, res) => res.sendFile(path.join(__dirname, 'public', 'post_new.html')));
app.get('/posts/detail', (req, res) => res.sendFile(path.join(__dirname, 'public', 'post_detail.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));
app.get('/change-password', (req, res) => res.sendFile(path.join(__dirname, 'public', 'change-password.html')));

// Spring 백엔드로 리다이렉트
app.get('/privacy', (req, res) => {
  res.redirect(`${BACKEND_URL}/privacy`);
});

app.listen(PORT, () => console.log(`[frontend] http://localhost:${PORT} (proxy -> ${BACKEND_URL})`));
