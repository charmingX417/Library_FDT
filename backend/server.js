// 导入必要的模块
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // 解决跨域
const bodyParser = require('body-parser'); // 解析 JSON 请求体
const axios = require('axios');

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

// 获取所有图书信息
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).send('服务器错误');
            return;
        }
        console.log('查询图书成功'); // 打印数据库返回的结果
        res.json(results);
    });
});

// 添加图书信息（自动生成 ID）
app.post('/api/books', (req, res) => {
    const { title, author, isbn, category } = req.body;

    if (!title) {
        return res.status(400).send('书名不能为空'); // 如果书名为空，返回 400 错误
    }

    const sql = 'INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)';
    const values = [title, author || null, isbn || null, category || null];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('添加书籍失败:', err);
            res.status(500).send('添加书籍失败');
            return;
        }
        res.status(201).json({
            id: result.insertId, // 返回数据库自动生成的 ID
            title,
            author,
            isbn,
            category,
        });
    });
});

// 更新图书信息
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params; // 从路径参数获取图书 ID
    const { title, author, isbn, category } = req.body; // 从请求体获取更新数据

    // 定义更新 SQL 和参数
    const sql = `
        UPDATE books
        SET title = ?, author = ?, isbn = ?, category = ?
        WHERE id = ?
    `;
    const values = [title, author || null, isbn || null, category || null, id];

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

// 删除图书信息
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



// 插入书籍的辅助函数
const insertBook = (book) => {
    return new Promise((resolve, reject) => {
        const { title, author_name, isbn, catalog } = book;
        const sql = 'INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)';
        const values = [title, author_name || null, isbn || null, catalog || null];

        db.query(sql, values, (err) => {
            if (err) {
                console.error(`插入书籍失败: ${title}`, err);
                reject(`插入书籍失败: ${title}`);
            } else {
                resolve();
            }
        });
    });
};
// API 路由：调用外部 API 并存储数据(手动操作)
app.get('/api/fetchBooksFromAPI', async (req, res) => {
    const apiKey = '1c46650dc15cf913272974d27e608cb4'; // 替换为你的 API 密钥
    const catalogId = 249; // 示例分类 ID，手动设置
    const pn = 1; // 页码
    const rn = 10; // 每页返回的记录数
    const dtype = 'json'; // 返回数据格式，默认为 JSON

    const apiUrl = 'http://apis.juhe.cn/goodbook/query';

    try {
        // 调用外部 API 获取书籍数据，传递请求参数
        const response = await axios.get(apiUrl, {
            params: {
                key: apiKey,
                catalog_id: catalogId,
                pn: pn,
                rn: rn,
                dtype: dtype
            }
        });

        const { result } = response.data;

        if (!result || !result.data || result.data.length === 0) {
            return res.status(404).send('未找到书籍数据');
        }

        const books = result.data;
        const insertPromises = books.map(book => insertBook(book));

        // 等待所有插入操作完成
        await Promise.all(insertPromises);
        res.send(`成功插入 ${books.length} 条书籍记录到数据库`);
    } catch (error) {
        console.error('调用外部 API 失败:', error);
        res.status(500).send('获取书籍数据失败');
    }
});

app.get('/api/streamBooks', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendData = async () => {
        try {
            const [results] = await db.query('SELECT * FROM books');
            const categoryCounts = results.reduce((counts, book) => {
                const category = book.category;
                if (category) {
                    counts[category] = (counts[category] || 0) + 1;
                }
                return counts;
            }, {});

            res.write(`data: ${JSON.stringify({ categoryCounts })}\n\n`);
        } catch (error) {
            console.error('Error fetching book data:', error);
            res.write(`data: ${JSON.stringify({ error: 'Error fetching book data' })}\n\n`);
        }
    };

    setInterval(sendData, 30000); // 每 30 秒发送一次数据更新

    // 监听连接关闭
    req.on('close', () => {
        console.log('Connection closed');
    });
});


// 启动服务器
app.listen(port, () => {
    console.log(`后端服务器已启动：http://localhost:${port}`);
});
