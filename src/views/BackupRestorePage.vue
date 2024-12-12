<template>
  <div class="backup-restore-page">
    <h2>数据监控与展示</h2>
    <el-divider></el-divider>

    <!-- MQTT 连接状态 -->
    <div class="connection-status">
      <h3>MQTT 连接状态: {{ connectionStatus }}</h3>
    </div>

    <el-divider></el-divider>

    <!-- 实时接收的文字数据 -->
    <div class="text-section">
      <h3>实时文字数据</h3>
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
      this.messages.push(message);
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
  padding: 20px;
}

.connection-status {
  margin-bottom: 20px;
  font-size: 18px;
  color: #42b983;
}

.text-section {
  margin-bottom: 20px;
}

.text-display {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 10px;
}

.chart-section {
  margin-top: 20px;
}
</style>
