const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // 解决跨域
const bodyParser = require('body-parser'); // 解析 JSON 请求体
const app = express();
const port = 3000;

// 启用中间件
app.use(cors());
app.use(bodyParser.json()); // 用于解析 JSON 数据

// 创建数据库连接
const db = mysql.createConnection({
    host: '113.45.19.121', // 数据库主机
    user: 'root', // 数据库用户名
    password: 'Luoxuelin040430', // 数据库密码
    database: 'book', // 数据库名称
    connectTimeout: 10000 // 设置连接超时时间为 10 秒
});

// 连接到数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('成功连接到数据库');
});

// 获取图书信息
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).send('服务器错误');
            return;
        }
        console.log('查询结果:', results); // 打印数据库返回的结果
        res.json(results);
    });
});

// 添加图书信息（使用路径参数来传递编号）
app.post('/api/books/:id', (req, res) => {
    const bookId = req.params.id; // 从路径参数中获取编号
    const { title, author, isbn, category } = req.body;

    // 如果字段为空，将其设置为 null
    if (!title) {
        return res.status(400).send('书名不能为空'); // 如果书名为空，返回 400 错误
    }

    const safeAuthor = author || null;
    const safeIsbn = isbn || null;
    const safeCategory = category || null;

    // 使用路径参数中的编号
    const sql = 'INSERT INTO books (id, title, author, isbn, category) VALUES (?, ?, ?, ?, ?)';
    const values = [bookId, title, safeAuthor, safeIsbn, safeCategory];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('添加书籍失败:', err);
            res.status(500).send('添加书籍失败');
            return;
        }
        res.status(201).json({
            id: bookId, // 返回新书的 ID
            title,
            author: safeAuthor,
            isbn: safeIsbn,
            category: safeCategory,
        });
    });
});

// 更新图书信息
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params; // 从路径参数获取图书 ID
    const { title, author, isbn, created_at, updated_at, category } = req.body; // 从请求体获取更新数据

    // 定义更新 SQL 和参数
    const sql = `
        UPDATE books
        SET title = ?, author = ?, isbn = ?, created_at = ?, updated_at = ?, category = ?
        WHERE id = ?
    `;
    const values = [title, author, isbn, created_at, updated_at, category, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('更新失败:', err);
            res.status(500).send({ error: '更新失败' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ error: '书籍未找到' });
            return;
        }
        res.send({ message: '书籍更新成功', affectedRows: result.affectedRows });
    });
});


app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id; // 从路径参数中获取书籍编号

    // SQL 查询以删除指定 ID 的书籍
    const sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [bookId], (err, result) => {
        if (err) {
            console.error('删除书籍失败:', err);
            res.status(500).send('删除书籍失败');
            return;
        }

        if (result.affectedRows === 0) {
            // 如果没有匹配的书籍 ID
            return res.status(404).send('书籍不存在');
        }

        res.status(200).send(`书籍 ID ${bookId} 已删除`);
    });
});


// 启动服务器
app.listen(port, () => {
    console.log(`后端服务器已启动：http://localhost:${port}`);
});
