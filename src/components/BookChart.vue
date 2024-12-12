<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" v-if="chartData.labels.length > 0" />
    <p v-else>Loading data...</p>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// 注册所有需要的 Chart.js 模块
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// 定义自定义插件
const CenterTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;

    // 获取总书本数量
    const totalBooks = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

    // 绘制文本
    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("总书本数", width / 2, height / 2 - 10); // 主标题
    ctx.fillText(totalBooks, width / 2, height / 2 + 10); // 数字
    ctx.restore();
  },
};

export default {
  name: "BookChart",
  components: {
    Doughnut,
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "图书分类数量",
            data: [],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#42b983",
              "#FF5722",
              "#9C27B0",
              "#FFC107",
              "#4CAF50",
            ],
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              boxWidth: 12,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}本书`;
              },
            },
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
      },
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:3000/api/books");
      if (response.data && Array.isArray(response.data)) {
        const categoryCounts = {};
        response.data.forEach((book) => {
          const category = book.category;
          if (category) {
            if (!categoryCounts[category]) {
              categoryCounts[category] = 0;
            }
            categoryCounts[category]++;
          }
        });

        this.chartData = {
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              label: "图书分类数量",
              data: Object.values(categoryCounts),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#42b983",
                "#FF5722",
                "#9C27B0",
                "#FFC107",
                "#4CAF50",
              ],
              borderWidth: 1,
            },
          ],
        };
      } else {
        console.error("数据加载失败，未获取到书籍数据");
      }
    } catch (error) {
      console.error("请求错误:", error);
    }
  },
  mounted() {
    // 注册自定义插件
    ChartJS.register(CenterTextPlugin);
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 20px 0;
  border: none;
  box-shadow: none;
}

.chart-container canvas {
  border: none;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
