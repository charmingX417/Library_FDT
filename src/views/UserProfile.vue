<template>
  <div class="user-profile">
    <h2>🌟 欢迎回来，{{ username }} 🌟</h2>
    <el-row>
      <!-- 用户信息区域 -->
      <el-col :span="6">
        <el-card class="user-card" shadow="hover">
          <div>
            <img :src="userAvatar" alt="用户头像" class="user-avatar" />
          </div>
          <div class="user-details">
            <p><strong>用户名：</strong>{{ username }}</p>
            <p><strong>签名：</strong>{{ signature || "这个人很懒，还没有设置签名" }}</p>
          </div>
          <div class="button-group">
            <el-button type="primary" size="small" @click="fetchBorrowedBooks">
              📚 查询借书记录
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 借书记录区域 -->
      <el-col :span="18">
        <el-card class="book-card" shadow="hover">
          <h3>📚 借书记录</h3>
          <el-list :data="borrowedBooks">
            <el-list-item v-for="(book, index) in borrowedBooks" :key="index">
              <div style="display: flex; justify-content: space-between;font-size: 25px;">
                <span>《{{ book.title }}》</span>
                <span>{{ formatDate(book.borrowedAt) }}</span>
              </div>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import defaultAvatar from "@/assets/xuejie.jpg"; // 默认头像

export default {
  name: "UserProfile",
  setup() {
    const username = ref("未登录");
    const userAvatar = ref(defaultAvatar); // 默认头像
    const signature = ref(""); // 默认签名为空
    const userId = ref(null); // 存储用户ID

    // 借书信息
    const borrowedBooks = ref([]);

    // 格式化借书时间
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleString(); // 格式化为本地日期字符串
    };

    // 在组件挂载时获取本地存储的用户信息并查询用户详细信息
    onMounted(async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.username) {
        username.value = storedUser.username; // 从localStorage获取用户名

        // 通过用户名从后端获取完整用户信息
        try {
          const response = await axios.get("http://localhost:3000/api/users");
          const user = response.data.find(u => u.username === storedUser.username);
          if (user) {
            userAvatar.value = storedUser.avatar || defaultAvatar; // 如果没有头像，使用默认头像
            signature.value = user.signature || "未设置签名"; // 如果没有签名，使用默认文字
            userId.value = user.userId; // 获取用户ID
          } else {
            console.error("未找到用户信息");
          }
        } catch (error) {
          console.error("查询用户信息失败:", error);
        }
      }
    });

    // 查询借书记录
    const fetchBorrowedBooks = async () => {
      if (!userId.value) {
        alert("用户ID为空，无法查询借书记录");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/user-borrowed-books/${userId.value}`);
        console.log(response.data); // 打印返回的数据，检查借书记录格式
        borrowedBooks.value = response.data.borrowedBooks || [];
      } catch (error) {
        console.error("获取借书记录失败:", error);
        alert("获取借书记录失败，请稍后重试");
      }
    };

    return {
      username,
      userAvatar,
      signature,
      borrowedBooks,
      fetchBorrowedBooks,
      formatDate
    };
  }
};
</script>

<style scoped>
.user-profile {
  width: 80%;
  height: 80%;
  padding: 50px;

  background-color: #f9f3f2;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Comic Sans MS', cursive;
  margin: 0 auto;
}

.user-card {
  text-align: center;
  padding: 20px;
  border: 2px dashed #f7c3c2;
  background-color: #fff7f6;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.book-card {
  width: 50%;
  height: 80%;
  padding: 20px;
  border: 2px dashed #f7c3c2;
  background-color: #fff7f6;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: scale(1.02);
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid #fbc2c0;

  /* 调整裁剪方式 */
  object-fit: cover; /* 保持图片的纵横比，同时裁剪多余部分以填满容器 */
  object-position: top; /* 控制裁剪位置，默认是居中裁剪 */
}

.user-details {
  font-size: 18px;
  color: #444;
  line-height: 1.8;
}

.button-group {
  margin-top: 15px;
}

.el-button {
  background-color: #ffbbcc;
  color: white;
  border-radius: 15px;
}

.el-button:hover {
  background-color: #ff99aa;
}

.el-list {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.el-list-item {
  padding: 10px;
  border-bottom: 1px solid #f7c3c2;
}

.el-list-item:last-child {
  border-bottom: none;
}

</style>
