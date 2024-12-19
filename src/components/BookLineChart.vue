<template>
  <div class="chart-container">
    <!-- 显示新增书本数 -->
    <div class="header">
      <h2>过去一周每日新增书本数</h2>
    </div>

    <!-- 折线图 -->
    <Line
        class="Line"
        :key="chartData.labels.join('-')"
        :data="chartData"
        :options="chartOptions"
        v-if="chartData.labels.length > 0"
    />
    <p v-else>Loading data...</p>

    <!-- 显示总数变化 -->
    <div v-if="totalBooksChanged !== null" class="total-books-status">
      <p>{{ totalBooksChanged }}</p>
    </div>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";
import dayjs from "dayjs";

// 注册 Chart.js 必需模块
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale
);

export default {
  name: "BookCountChart",
  components: {
    Line,
  },
  data() {
    return {
      chartData: {
        labels: [], // 日期
        datasets: [
          {
            label: "每日新增书本数",
            data: [], // 每日新增书本的统计数据
            borderColor: "#0dfd17",
            backgroundColor: "rgba(29,237,36,0.2)", // 设置为绿色的背景填充
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#4CAF50",
            fill: 'origin', // 填充从折线到横坐标的一半区域
          },
          {
            label: "总书本数量",
            data: [], // 每天的总书本数量
            borderColor: "rgba(13,158,244,0.91)",
            backgroundColor: "rgba(33, 150, 243, 0.2)", // 填充颜色
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#2196F3",
            fill: 'start', // 填充从折线起点开始的区域
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                family: "Comic Sans MS", // 使用俏皮可爱的字体
                size: 16, // 加粗字体
                weight: "bold", // 设置加粗
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw} 本书`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "日期",
              font: {
                family: "Comic Sans MS", // 使用俏皮可爱的字体
                size: 18, // 字体大小
                weight: "bold", // 字体加粗
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "Comic Sans MS", // 字体可爱俏皮
                size: 14, // 横坐标字体大小
                weight: "bold", // 横坐标字体加粗
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "书本数量",
              font: {
                family: "Comic Sans MS", // 使用俏皮可爱的字体
                size: 18, // 字体大小
                weight: "bold", // 字体加粗
              },
            },
            beginAtZero: true,
            ticks: {
              font: {
                family: "Comic Sans MS", // 纵坐标可爱俏皮的字体
                size: 14, // 纵坐标字体大小
                weight: "bold", // 纵坐标字体加粗
              },
            },
            min:-100,
            max: 200,
          },
        },
      },
      totalBooksCount: 0, // 当前书本总数
      totalBooksChanged: null, // 书本总数变化状态
    };
  },
  async mounted() {
    await this.loadBooksData();
  },
  methods: {
    async loadBooksData() {
      try {
        const response = await axios.get("http://localhost:3000/api/books");
        if (response.data) {
          const books = response.data;

          // 计算当前总书本数量
          let currentCount = 0;
          const dateRange = [];
          const dailyCounts = {}; // 按日期分组的统计结果
          const dailyDeletions = {}; // 每日删除的书本数

          // 获取今天的日期（包括具体的时间）
          const today = dayjs();

          // 生成日期范围：当前日期 - 过去两周
          for (let i = -14; i <= 0; i++) {
            dateRange.push(today.add(i, "day").format("YYYY-MM-DD")); // 获取过去14天的日期
          }

          // 遍历书本数据并统计
          books.forEach((book) => {
            const createdAt = dayjs(book.created_at); // 获取创建时间（包含具体时间）
            const updatedAt = dayjs(book.updated_at); // 获取更新时间
            const deleteAt = book.delete_at ? dayjs(book.delete_at) : null;
            const createdDate = createdAt.format("YYYY-MM-DD");

            // 只考虑在日期范围内的数据
            if (dateRange.includes(createdDate)) {
              // 如果是新增的书本
              dailyCounts[createdDate] = (dailyCounts[createdDate] || 0) + 1;
              currentCount++; // 累计当前书本总数
            }

            // 如果书本被删除，记录删除日期
            if (book.isdelete === 1 && deleteAt && dateRange.includes(deleteAt.format("YYYY-MM-DD"))) {
              dailyDeletions[deleteAt.format("YYYY-MM-DD")] = (dailyDeletions[deleteAt.format("YYYY-MM-DD")] || 0) + 1;
              currentCount--; // 删除时减少书本总数
            }
          });

          // 填充图表数据
          this.chartData.labels = dateRange; // 横坐标为日期范围
          this.chartData.datasets[0].data = dateRange.map((date) => {
            // 在计算每日新增书本数时，同时减去删除的书本数
            return (dailyCounts[date] || 0) - (dailyDeletions[date] || 0);
          });

          // 计算每天的总书本数量（在原有基础上逐步增加/减少）
          let runningTotal = 0;
          this.chartData.datasets[1].data = dateRange.map((date) => {
            runningTotal += (dailyCounts[date] || 0); // 增加新增的书本数
            runningTotal -= (dailyDeletions[date] || 0); // 减去删除的书本数
            return runningTotal;
          });

          // 动态设置 y 轴的最小值和最大值
          const minY = Math.min(...this.chartData.datasets[1].data) - 5; // 确保有一些空白区域
          const maxY = Math.max(...this.chartData.datasets[1].data) + 5; // 确保有一些空白区域

          // 更新 chartOptions 中的 y 轴配置
          this.chartOptions.scales.y.min = minY;
          this.chartOptions.scales.y.max = maxY;

          // 保存当前总数到 localStorage
          this.totalBooksCount = currentCount;
          const lastTotalBooksCount = localStorage.getItem("lastTotalBooksCount");

          if (lastTotalBooksCount !== null) {
            const lastCount = parseInt(lastTotalBooksCount, 10);
            if (currentCount > lastCount) {
              this.totalBooksChanged = `新增了 ${currentCount - lastCount} 本书`;
            } else if (currentCount < lastCount) {
              this.totalBooksChanged = `删除了 ${lastCount - currentCount} 本书`;
            } else {
              this.totalBooksChanged = "书本总数未变化";
            }
          } else {
            this.totalBooksChanged = "这是第一次加载数据";
          }

          // 更新存储的总书本数量
          localStorage.setItem("lastTotalBooksCount", currentCount);
        }
      } catch (error) {
        console.error("加载图书数据失败:", error);
      }
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%; /* 容器宽度占满父容器 */
  max-width: 900px;
  height: 400px;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(45deg, rgba(0, 204, 255, 1), rgba(251, 198, 183, 0.8), rgba(255, 182, 193, 1), rgba(255, 218, 185, 0.8), rgba(255, 105, 180, 1)); /* 多种柔和的颜色混合渐变 */
  border-radius: 15px; /* 增加圆角 */
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.2); /* 更强的阴影效果 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 增加过渡效果 */
}

.chart-container:hover {
  transform: translateY(-10px); /* 鼠标悬停时提升容器 */
  box-shadow: 0px 12px 40px rgba(0, 0, 0, 0.3); /* 增强悬停时的阴影 */
}

.chart-container .header h2 {
  color: #13ffda; /* 标题文字颜色 */
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.chart-container .chart-content {
  background-color: rgba(255, 255, 255, 0.85); /* 设置图表部分的背景色为半透明 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* 为图表部分增加轻微阴影 */
  width: 100%;
  height: 100%;
}


.header {
  text-align: center;
  margin-bottom: 20px;
  color: #13a81c;
}

.chart-container canvas {
  width: 100% !important; /* 确保 canvas 宽度占满容器 */
  height: 100% !important; /* 确保 canvas 高度占满容器 */
}

.total-books-status {
  margin-top: 10px;
  font-size: 16px;
  color: #ff9800;
}

@media (max-width: 768px) {
  .chart-container {
    height: 400px;
  }
}
</style>
