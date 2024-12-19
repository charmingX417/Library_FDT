// 导入必要的模块
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // 解决跨域
const bodyParser = require('body-parser'); // 解析 JSON 请求体
const axios = require('axios');
const bcrypt = require('bcrypt');
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

// 更新图书删除状态
app.put('/api/books/:id/delete', (req, res) => {
    const bookId = req.params.id; // 从路径参数中获取书籍编号
    const { isdelete, delete_at } = req.body; // 从请求体中获取更新的字段

    if (isdelete === undefined || !delete_at) {
        return res.status(400).send("缺少必要的参数");
    }

    // 获取当前时间
    const currentTime = new Date().toISOString(); // 获取当前时间并格式化为 ISO 字符串

    // 更新图书的 isdelete, delete_at 和 update_at 字段
    const sql = 'UPDATE books SET isdelete = ?, delete_at = ?, updated_at = ? WHERE id = ?';
    db.query(sql, [isdelete, delete_at, currentTime, bookId], (err, result) => {
        if (err) {
            console.error('更新删除状态失败:', err);
            res.status(500).send('更新删除状态失败');
            return;
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('书籍不存在');
        }

        res.status(200).send(`书籍 ID ${bookId} 已删除`);
    });
});



// 插入书籍的辅助函数
const insertBook = (book) => {
    return new Promise((resolve, reject) => {
        const { title, img, category, reading } = book;
        const sql = 'INSERT INTO books (title, img, category, reading) VALUES (?, ?, ?, ?)';
        const values = [title, img || null, category || null, reading || null];

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
// API 路由：调用外部 API 并存储数据
app.get('/api/fetchBooksFromAPI', async (req, res) => {
    const apiKey = '1c46650dc15cf913272974d27e608cb4'; // 替换为你的 API 密钥
    const catalogId = 247; // 示例分类 ID，手动设置
    const pn = 1; // 页码
    const rn = 20; // 每页返回的记录数
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

        // 提取每本书的数据并封装成对象
        const insertPromises = books.map(book => {
            const extractedData = {
                title: book.title,               // 书名
                img: book.img,                   // 图片
                category: book.catalog,          // 分类作为 category
                reading: book.reading            // 阅读人数
            };
            return insertBook(extractedData);  // 调用插入书籍的辅助函数
        });

        // 等待所有插入操作完成
        await Promise.all(insertPromises);
        res.send(`成功插入 ${books.length} 条书籍记录到数据库`);
    } catch (error) {
        console.error('调用外部 API 失败:', error);
        res.status(500).send('获取书籍数据失败');
    }
});


//服务器每 30 秒向客户端推送最新的书籍分类统计数据。
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


// 用户登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 查询用户账号密码
    const userQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(userQuery, [username], async (err, userResults) => {
        if (err) {
            console.error('查询用户失败:', err);
            return res.status(500).send('服务器错误');
        }

        if (userResults.length === 0) {
            return res.status(404).send('用户名不存在');
        }

        const user = userResults[0];

        // 检查密码是否匹配
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('密码错误');
        }

        // 返回用户信息或其他必要数据
        res.json({
            user: {
                id: user.id,
                username: user.username,
            },
        });
    });
});

// 借书接口
app.post('/api/borrowBook', (req, res) => {
    const { username, bookId } = req.body;

    console.log('请求参数:', req.body); // 打印请求参数
    const borrower = username; // 兼容变量

    // 通过用户名查询用户ID
    const getUserIdQuery = 'SELECT id FROM users WHERE username = ?';
    db.query(getUserIdQuery, [borrower], (err, userResults) => {
        if (err) {
            console.error('查询用户ID失败:', err);
            return res.status(500).send('服务器错误');
        }

        console.log('用户查询结果:', userResults);

        if (userResults.length === 0) {
            console.log('借书人不存在的错误被触发');
            return res.status(401).send('借书人不存在');
        }

        const userId = userResults[0].id; // 获取用户ID

        // 查询用户已借书数量
        const borrowCountQuery = 'SELECT COUNT(*) AS count FROM borrowed_books WHERE user_id = ?';
        db.query(borrowCountQuery, [userId], (err, countResults) => {
            if (err) {
                console.error('查询借书数量失败:', err);
                return res.status(500).send('服务器错误');
            }

            const borrowedCount = countResults[0].count;

            if (borrowedCount >= 5) {
                console.log('借书数量已达到上限的错误被触发');
                return res.status(402).send('借书数量已达到上限（5 本）');
            }

            // 检查书籍是否已借出
            const bookAvailabilityQuery = 'SELECT * FROM borrowed_books WHERE book_id = ?';
            db.query(bookAvailabilityQuery, [bookId], (err, bookResults) => {
                if (err) {
                    console.error('查询书籍状态失败:', err);
                    return res.status(500).send('服务器错误');
                }

                if (bookResults.length > 0) {
                    console.log('书籍已被借出的错误被触发');
                    return res.status(403).send('书籍已被借出');
                }

                // 插入借书记录，确保使用 borrowed_at 字段
                const borrowInsertQuery = 'INSERT INTO borrowed_books (user_id, book_id, borrowed_at) VALUES (?, ?, ?)';
                const borrowTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // 获取当前时间

                db.query(borrowInsertQuery, [userId, bookId, borrowTime], (err) => {
                    if (err) {
                        console.error('借书失败:', err);
                        return res.status(500).send('服务器错误');
                    }

                    // 更新书籍状态为已借出
                    const updateBookStatusQuery = 'UPDATE books SET isBorrowed = 1 WHERE id = ?';
                    db.query(updateBookStatusQuery, [bookId], (err) => {
                        if (err) {
                            console.error('更新书籍状态失败:', err);
                            return res.status(500).send('服务器错误');
                        }

                        res.status(200).send('借书成功');
                    });
                });
            });
        });
    });
});

// 还书接口
app.post('/api/returnBook', (req, res) => {
    const { userId, bookId } = req.body;

    const returnQuery = 'DELETE FROM borrowed_books WHERE user_id = ? AND book_id = ?';
    db.query(returnQuery, [userId, bookId], (err, result) => {
        if (err) {
            console.error('还书失败:', err);
            return res.status(500).send('服务器错误');
        }

        if (result.affectedRows === 0) {
            return res.status(400).send('未找到对应的借书记录');
        }

        res.status(200).send('还书成功');
    });
});

// 用户注册接口
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('用户名和密码不能为空');
    }

    // 检查用户名是否已存在
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], async (err, results) => {
        if (err) {
            console.error('检查用户名失败:', err);
            return res.status(500).send('服务器错误');
        }

        if (results.length > 0) {
            return res.status(400).send('用户名已被注册');
        }

        try {
            // 使用 bcrypt 加密密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 插入新用户
            const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertUserQuery, [username, hashedPassword], (err) => {
                if (err) {
                    console.error('注册失败:', err);
                    return res.status(500).send('服务器错误');
                }

                res.status(200).send('注册成功');
            });
        } catch (hashError) {
            console.error('密码加密失败:', hashError);
            res.status(500).send('服务器错误');
        }
    });
});

// 用户注销接口（带未还书籍检查）
app.post('/api/deleteUser', (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send('用户 ID 不能为空');
    }

    // 检查用户是否有未归还的借书记录
    const checkUnreturnedBooksQuery = 'SELECT COUNT(*) AS count FROM borrowed_books WHERE user_id = ?';
    db.query(checkUnreturnedBooksQuery, [userId], (err, results) => {
        if (err) {
            console.error('检查未归还书籍失败:', err);
            return res.status(500).send('服务器错误');
        }

        const unreturnedCount = results[0].count;

        if (unreturnedCount > 0) {
            return res.status(400).send(`用户有未归还的书籍，共计 ${unreturnedCount} 本，请先归还书籍后再注销账户`);
        }

        // 开启事务，删除用户和相关数据
        db.beginTransaction((err) => {
            if (err) {
                console.error('事务开启失败:', err);
                return res.status(500).send('服务器错误');
            }

            // 删除与用户相关的借书记录
            const deleteBorrowedBooksQuery = 'DELETE FROM borrowed_books WHERE user_id = ?';
            db.query(deleteBorrowedBooksQuery, [userId], (err) => {
                if (err) {
                    console.error('删除借书记录失败:', err);
                    return db.rollback(() => res.status(500).send('服务器错误'));
                }

                // 删除用户账户信息
                const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                db.query(deleteUserQuery, [userId], (err, result) => {
                    if (err) {
                        console.error('删除用户账户失败:', err);
                        return db.rollback(() => res.status(500).send('服务器错误'));
                    }

                    if (result.affectedRows === 0) {
                        return db.rollback(() => res.status(400).send('用户不存在'));
                    }

                    // 提交事务
                    db.commit((err) => {
                        if (err) {
                            console.error('事务提交失败:', err);
                            return db.rollback(() => res.status(500).send('服务器错误'));
                        }

                        res.status(200).send('用户注销成功');
                    });
                });
            });
        });
    });
});

// 查询所有用户信息   及借书情况，包括借书时间
app.get('/api/users', (req, res) => {
    const query = `
        SELECT
            u.id AS userId,
            u.username,
            u.age,
            u.sex,
            u.signature,
            GROUP_CONCAT(bb.book_id) AS borrowedBookIds,
            GROUP_CONCAT(b.title) AS borrowedBookTitles,
            GROUP_CONCAT(bb.borrowed_at) AS borrowedAtDates
        FROM users u
                 LEFT JOIN borrowed_books bb ON u.id = bb.user_id
                 LEFT JOIN books b ON bb.book_id = b.id
        GROUP BY u.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询用户信息失败:', err);
            return res.status(500).send('服务器错误');
        }

        const formattedResults = results.map((row) => ({
            userId: row.userId,
            username: row.username,
            age: row.age,
            sex: row.sex,
            signature: row.signature,
            borrowedBooks: row.borrowedBookIds
                ? row.borrowedBookIds.split(',').map((bookId, index) => ({
                    bookId: parseInt(bookId, 10),
                    title: row.borrowedBookTitles.split(',')[index],
                    borrowedAt: row.borrowedAtDates.split(',')[index], // 借书时间
                }))
                : [],
        }));

        res.json(formattedResults);
    });
});

// 获取特定用户的借书记录及借书时间
app.get('/api/user-borrowed-books/:id', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT 
            bb.book_id AS bookId,
            b.title AS title,
            bb.borrowed_at AS borrowedAt
        FROM borrowed_books bb
        LEFT JOIN books b ON bb.book_id = b.id
        WHERE bb.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('查询借书记录失败:', err);
            return res.status(500).send('服务器错误');
        }

        res.json({ borrowedBooks: results });
    });
});

// 获取所有借书记录的接口
app.get('/api/borrowRecords', (req, res) => {
    const query = `
    SELECT
      borrowed_books.id,
      borrowed_books.user_id,
      borrowed_books.book_id,
      borrowed_books.borrowed_at,
      borrowed_books.returned_at,
      users.username,
      books.title AS bookTitle
    FROM borrowed_books
    JOIN users ON borrowed_books.user_id = users.id
    JOIN books ON borrowed_books.book_id = books.id
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询借书记录失败:', err);
            return res.status(500).send('服务器错误');
        }

        // 返回借书记录
        res.status(200).json(results);
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`后端服务器已启动：http://localhost:${port}`);
});
