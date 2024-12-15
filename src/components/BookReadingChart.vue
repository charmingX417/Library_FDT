<template>
  <div class="chart-container">
    <Bar
        :key="chartData.labels.join('-')"
        :data="chartData"
        :options="chartOptions"
        v-if="chartData.labels.length > 0"
    />
    <p v-else>Loading data...</p>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// 注册 Chart.js 模块
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "ReadingStatsChart",
  components: {
    Bar,
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "分类阅读人数",
            data: [],
            backgroundColor: [], // 动态生成颜色
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw} 人`;
              },
            },
          },
        },
      },
      showTotalBooks: true, // 控制是否显示总书本数
    };
  },

  async mounted() {
    // 在组件挂载时加载数据
    await this.loadChartData();
  },
  methods: {
    // 动态生成颜色
    generateColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count; // 根据分类数均分色相
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    },

    // 加载图表数据
    async loadChartData() {
      try {
        const response = await axios.get("http://localhost:3000/api/books");
        if (response.data && Array.isArray(response.data)) {
          const categoryReadings = {};
          response.data.forEach((book) => {
            const {category, reading} = book;
            if (category && reading) {
              categoryReadings[category] = (categoryReadings[category] || 0) + reading;
            }
          });

          // 更新图表数据
          this.chartData.labels = Object.keys(categoryReadings);
          this.chartData.datasets[0].data = Object.values(categoryReadings);

          // 动态生成背景颜色
          this.chartData.datasets[0].backgroundColor = this.generateColors(Object.keys(categoryReadings).length);
        } else {
          console.error("数据加载失败，未获取到书籍数据");
        }
      } catch (error) {
        console.error("请求错误:", error);
      }
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  max-width: 900px;
  height: 400px;
  margin: 20px auto;
  border: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>
