<template>
  <div class="backup-restore-page">
    <h1>数据监控与展示</h1>
    <el-divider></el-divider>

    <!-- MQTT 连接状态 -->
    <div class="connection-status">
      <h3>MQTT 连接状态: {{ connectionStatus }}</h3>
    </div>

    <el-divider></el-divider>

    <!-- 实时接收的文字数据 -->
    <div class="text-section">
      <h2>实时文字数据</h2>
      <el-scrollbar class="text-display">
        <ul>
          <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
        </ul>
      </el-scrollbar>
    </div>

    <el-divider></el-divider>

    <!-- 图表展示部分 -->
    <div class="chart-section">
      <h3>数据图表展示</h3>
      <el-row>
        <el-col :span="24">
          <el-card>
            <line-chart :chart-data="chartData" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// 导入 MQTT 管理器和图表组件
import {connectMQTT, subscribeTopic} from "@/utils/mqtt";
import LineChart from "@/components/LineChart.vue";


export default {
  name: "BackupRestorePage",
  components: {
    LineChart,
  },
  data() {
    return {
      messages: [],
      connectionStatus: "未连接",
      chartData: {
        labels: [],
        datasets: [
          {
            label: "温度数据",
            backgroundColor: "#42A5F5",
            borderColor: "#1E88E5",
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.connectMqtt();
  },
  methods: {
    async connectMqtt() {
      try {
        const client = connectMQTT();
        this.connectionStatus = "已连接";

        // 订阅主题并处理消息
        subscribeTopic("/k0sicNTchIC/Bob1/user/get", (message) => {
          this.handleTextMessage(message);
        });
      } catch (error) {
        console.error("MQTT 连接失败:", error);
        this.connectionStatus = "连接失败";
      }
    },
    handleTextMessage(message) {
      const now = new Date().toLocaleTimeString();  // 获取当前时间戳
      this.messages.push({ text: message, time: now });  // 保存消息和时间戳
      try {
        const data = JSON.parse(message);
        if (data.temperature) {
          this.updateChart(data.temperature);
        }
      } catch (e) {
        console.warn("消息解析失败:", e);
      }
    },
    updateChart(temperature) {
      const now = new Date().toLocaleTimeString();
      this.chartData.labels.push(now);
      this.chartData.datasets[0].data.push(temperature);

      if (this.chartData.labels.length > 20) {
        this.chartData.labels.shift();
        this.chartData.datasets[0].data.shift();
      }
    },
  },
};
</script>

<style>
.backup-restore-page {
  padding: 30px;
  background: rgba(255, 255, 255, 0.25); /* 让容器稍微透明 */
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 可爱的字体 */
}

.connection-status {
  margin-bottom: 20px;
  font-size: 20px;
  color: #00FF00 !important; /* 强制使用亮绿色 */
  font-weight: bold;
  text-align: center;
}

.text-section {
  margin-bottom: 30px;
}

.text-display {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #FFB6C1; /* 浅粉色边框 */
  border-radius: 10px;
  padding: 15px;
  background-color: #FFF0F5; /* 浅粉色背景 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.text-display li {
  color: #FF1493; /* 亮粉色文字 */
  font-size: 16px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 8px;
  background-color: #FFF5EE; /* 浅蜜色背景 */
  transition: background-color 0.3s ease;
}

.text-display li:hover {
  background-color: #FFD1DC; /* 柔和的粉色，增强互动感 */
}

.chart-section {
  margin-top: 30px;
  background: #FCE4EC; /* 柔和的淡桃色背景，更适合与粉色搭配 */
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: left;
  color: #05fbcd; /* 亮粉色字体 */
  margin-bottom: 20px;
}

h1{
  font-size: 35px;
  color: #ffb3e5;
}
h2 {
  font-size: 28px;
}

h3 {
  font-size: 25px;
  margin-bottom: 15px;
}

.el-divider {
  border-color: #FFB6C1; /* 浅粉色分隔线 */
}

.el-row {
  display: flex;
  justify-content: center;
}

.el-col {
  max-width: 600px;
}

.el-card {
  background-color: #FFF0F5; /* 浅粉色背景 */
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.el-scrollbar {
  padding: 0 10px;
}
</style>






