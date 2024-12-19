<template>
  <div class="chart-container">
    <Doughnut
        :key="chartData.labels.join('-')"
        :data="chartData"
        :options="chartOptions"
        v-if="chartData.labels.length > 0"
    />
    <p v-else>Loading data...</p>

    <!-- 显示总书本数 -->
    <div v-if="isDataLoaded" class="total-books">
      <h3>总书本数: {{ totalBooks }} 本</h3>
    </div>
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
            data: [],  // 存储图表的数据
            backgroundColor: [], // 动态生成颜色
            borderWidth: 1,
          },
        ],
      },
      totalBooks: 0, // 存储总书本数
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 20,
              font: {
                size: 15,
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
        // 设置切割部分，形成环形效果
        cutout: "50%",  // 中心空心部分的比例
        elements: {
          arc: {
            borderWidth: 2, // 设置每个扇形的边框宽度
            borderColor: 'white', // 设置每个扇形的边框颜色
          },
        },
      },
      isDataLoaded: false, // 数据加载完成标志
    };
  },
  async mounted() {
    // 在组件挂载时加载数据
    await this.loadChartData();
  },
  watch: {
    // 监听数据加载标志
    isDataLoaded(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$forceUpdate(); // 强制更新图表渲染
        });
      }
    },
  },
  methods: {
    // 动态生成颜色的方法
    generateColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count; // 使用 HSL 色彩空间生成不同的颜色
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    },

    // 加载图表数据
    async loadChartData() {
      try {
        const response = await axios.get("http://localhost:3000/api/books");
        if (response.data && Array.isArray(response.data)) {
          const categoryCounts = {};

          // 筛选掉 isdelete 为 1 的书籍
          const validBooks = response.data.filter((book) => book.isdelete !== 1);

          validBooks.forEach((book) => {
            const category = book.category;
            if (category) {
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
          });

          // 更新图表数据
          this.chartData.labels = Object.keys(categoryCounts);
          this.chartData.datasets[0].data = Object.values(categoryCounts);

          // 动态生成背景颜色
          this.chartData.datasets[0].backgroundColor = this.generateColors(Object.keys(categoryCounts).length);

          // 计算总书本数
          this.totalBooks = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

          // 数据加载完成后，通知组件更新
          this.isDataLoaded = true;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75%;
  max-width: 800px;
  height: 400px;
  margin: 20px 0;
  border: none;
  box-shadow: none;
}

.total-books {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.chart-container canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}

.total-books {
  margin-top: 1px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: left; /* 确保文本居中 */
  width: 50%; /* 保证占据100%宽度 */
}
</style>
