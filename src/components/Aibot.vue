<template>
  <div class="ai-bot">
    <!-- 等待AI回复时显示加载提示 -->
    <div v-if="isWaitingForResponse" class="loading-indicator">
      <p>ATRI 正在高速思考中......</p>
    </div>
    <div class="chat-box">
      <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message', message.from === currentUser ? 'user' : 'ai']"
      >
        <div v-if="message.from === 'AI'" class="avatar">
          <img src="https://s2.loli.net/2024/12/19/MVAvNPawDxSuE1c.gif" alt="AI Avatar" />
        </div>
        <p><strong>{{ message.from === 'AI' ? aiName : message.from }}:</strong> {{ message.text }}</p>
      </div>
    </div>

    <!-- 输入框和按钮 -->
    <div class="input-area">
      <input
          v-model="userInput"
          type="text"
          placeholder="请输入问题..."
          @keydown.enter="sendMessage"
          :disabled="isWaitingForResponse"
      />
      <button @click="sendMessage" :disabled="isWaitingForResponse">发送</button>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userInput = ref('');
const chatMessages = ref([
  { from: 'AI', text: '高性能的ATRI在这里！' },
]);

const isWaitingForResponse = ref(false);
const currentUser = ref(''); // 当前用户
const aiName = ref('ATRI'); // AI的名称

const atriReplies = ref([
  "你好呀！是叫我吗？",
  "嘿，怎么了？我在这里哦！",
  "你叫我吗？我在这里，随时准备帮助你！",
  "嘿嘿，怎么这么快就想我了？",
  "是时候让我帮助你了！",
]);

const newReply = ref('');

const apiKey = 'sk-xcyp3NlavHoeNiYbAc0241327a794a63B2D76f34B8B99d22';
const apiUrl = 'https://api.vveai.com';

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    currentUser.value = user.username;
  }
});

const sendMessage = async () => {
  if (userInput.value.trim() && !isWaitingForResponse.value) {
    const messageText = userInput.value.trim();
    userInput.value = '';
    isWaitingForResponse.value = true;
    chatMessages.value.push({ from: currentUser.value, text: messageText });

    let aiReply = '';
    const userMessage = messageText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // 清理掉非字母数字字符并转小写
    if (userMessage.includes('atri')) {
      const randomIndex = Math.floor(Math.random() * atriReplies.value.length);
      aiReply = atriReplies.value[randomIndex];
    } else {
      try {
        const response = await axios.post(
            `${apiUrl}/v1/chat/completions`,
            {
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: '你是一个友好的AI助手。' },
                ...chatMessages.value.map((msg) => ({
                  role: msg.from === currentUser.value ? 'user' : 'assistant',
                  content: msg.text,
                })),
              ],
              max_tokens: 300,
              temperature: 0.7,
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
        );
        aiReply = response.data.choices[0].message.content;
      } catch (error) {
        console.error('Error fetching from API:', error);

        if (error.response?.status === 429) {
          aiReply = '请求过于频繁，请稍后再试。';
        } else {
          aiReply = `抱歉，发生了错误：${error.message}`;
        }
      }
    }

    chatMessages.value.push({ from: 'AI', text: aiReply });
    isWaitingForResponse.value = false;
  }
};

// 动态添加新的ATRI回复
const addReply = () => {
  if (newReply.value.trim()) {
    atriReplies.value.push(newReply.value.trim());
    newReply.value = ''; // 清空输入框
  }
};
</script>

<style scoped>
.ai-bot {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: transparent;
  padding: 20px;
  backdrop-filter: blur(0px);
}

.chat-box {
  flex-grow: 1; /* 允许聊天框占用剩余空间 */
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  max-height: 80vh; /* 保证聊天框不会超过屏幕 */
  padding-bottom: 80px; /* 为输入框留出空间 */
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  max-width: 40%;
}

.message.user {
  background-color: #ffb6c1; /* 淡粉色 */
  margin-left: auto;
  text-align: right;
  border-top-left-radius: 25px; /* 圆角效果 */
  border-top-right-radius: 5px;
}

.message.ai {
  background-color: #f8c5d5; /* 更柔和的粉色 */
  text-align: left;
  border-top-left-radius: 5px;
  border-top-right-radius: 25px; /* 圆角效果 */
}

.message .avatar {
  margin-right: 10px;
}

.message .avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.message p {
  font-family: 'Comic Sans MS', sans-serif; /* 可爱感的字体 */
  font-size: 1.1rem;
  color: #333; /* 字体颜色 */
  line-height: 1.4;
}

/* 确保输入框和按钮固定在底部 */
.input-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  position: sticky; /* 固定输入框位置 */
  bottom: 0; /* 使输入框始终位于底部 */
  background-color: rgba(255, 255, 255, 0.01);
  z-index: 1;
}

input {
  width: 80%;
  padding: 10px;
  border: 1px solid #f06292;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 1rem;
}

button {
  padding: 10px 15px;
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #c2185b;
  cursor: not-allowed;
}

button:hover {
  background-color: #d81b60;
}

button:active {
  background-color: #ad1457;
}

/* 显示加载提示 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 1.2rem;
  color: #21ffa2;
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 可爱的字体 */
}

/* 添加新回复的输入框样式 */
.add-reply {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-reply input {
  width: 80%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #f06292;
}

.add-reply button {
  padding: 10px 15px;
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.add-reply button:hover {
  background-color: #d81b60;
}

</style>
