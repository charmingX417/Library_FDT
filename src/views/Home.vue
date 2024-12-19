<template>
  <div class="home">
    <h2 class="gradient-text">纵使诗千行百般长，亦不及我念你铿锵</h2>

    <!-- 主容器布局 -->
    <div class="main-content">
      <!-- 轮播图和天气模块 -->
      <div class="top-section">
        <div class="carousel-section">
          <el-carousel
              :interval="5000"
              height="400px"
              indicator-position="outside"
          >
            <el-carousel-item v-for="(slide, index) in slides" :key="index" v-show="slide.image">
              <a :href="slide.link" target="_blank" class="slide-link">
                <img :src="slide.image" :alt="slide.alt" class="carousel-image" />
                <div class="carousel-caption">{{ slide.caption }}</div>
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="weather-container">
          <img :src="weatherIcon" alt="天气图标" class="weather-icon" />
          <p class="weather-date">📅 {{ weatherData.date }} | {{ weatherData.week }}</p>
          <p class="weather-name">☁️ {{ weatherData.weather }}</p>
          <p class="weather-location">📍 {{ weatherData.province }} - {{ weatherData.area }}</p>
          <p class="weather-info">
            当前温度: 🌡️ {{ weatherData.real }} <br>
            最低温度: ❄️ {{ weatherData.lowest }} | 最高温度: 🔥 {{ weatherData.highest }} <br>
            风速: 💨 {{ weatherData.wind }} | 风级: {{ weatherData.windsc }}
          </p>
          <p class="weather-sun">🌅 {{ weatherData.sunrise }} 日出 | 🌇 {{ weatherData.sunset }} 日落</p>
          <p class="weather-tips">💡 {{ weatherData.tips }}☺️☺️</p>
        </div>
      </div>

      <!-- 图表和格言模块 -->
      <div class="bottom-section">
        <div class="quote-container">
          <p class="quote">🌟🌟<br> {{ currentQuote }} <br>🌟🌟</p>
          <button @click="fetchNewQuote" class="change-quote-btn">换一换 🤹‍♂️</button>
        </div>
        <BookChart class="BookChart" />
        <BookCountChart class="BookCountChart" />
      </div>

    </div>
  </div>
</template>


<script>
import axios from "axios";
import baoxue from "@/assets/weather/baoxue.png";
import qingtian from "@/assets/weather/qingtian.png";
import baoyu from "@/assets/weather/baoyu.png";
import baoyuzhuanqing from "@/assets/weather/baoyuzhuanqing.png";
import dayuzhuanqing from "@/assets/weather/dayuzhuanqing.png";
import duoyun from "@/assets/weather/duoyun.png";
import duoyunzhuanqing from "@/assets/weather/duoyunzhuanqing.png";
import leizhenyu from "@/assets/weather/leizhenyu.png";
import shandian from "@/assets/weather/shandian.png";
import shaoyun from "@/assets/weather/shaoyun.png";
import tedaleizhenyu from "@/assets/weather/tedaleizhenyu.png";
import tedayangsha from "@/assets/weather/tedayangsha.png";
import wanjianduoyun from "@/assets/weather/wanjianduoyun.png";
import wanjianduoyunzhuanqing from "@/assets/weather/wanjianduoyunzhuanqing.png";
import wanjianqingtian from "@/assets/weather/wanjianqingtian.png";
import wanjianshaoyun from "@/assets/weather/wanjianshaoyun.png";
import xiaoyu from "@/assets/weather/xiaoyu.png";
import yingtian from "@/assets/weather/yingtian.png";
import zhenyu from "@/assets/weather/zhenyu.png";
import zhongxue from "@/assets/weather/zhongxue.png";
import yujiaxue from "@/assets/weather/yujiaxue.png";
import fuchen from "@/assets/weather/fuchen.png";
import yangsha from "@/assets/weather/yangsha.png";
import wu from "@/assets/weather/wu.png";
import BookCountChart from '@/components/BookLineChart.vue';
import BookChart from "@/components/BookChart.vue";
export default {
  name: "Home",
  components: {
    BookChart,
    BookCountChart,
  },
  data() {
    return {
      slides: [
        {
          image: "https://www.zwsview.com/wp-content/uploads/2018/02/20180203A0209000004.jpg",
          link: "https://www.jianshu.com/p/1e2f640946b8",
          alt: "Slide 1",
          caption: "读书丨重读《雪国》 赏析雪国的美、情、深", // 文字描述
        },
        {
          image: "https://s2.loli.net/2024/12/14/QE6ORv3MWPHfdtB.png",
          link: "https://www.thepaper.cn/newsDetail_forward_23812331",
          alt: "Slide 2",
          caption: "《认知觉醒》：普通人要逆袭，要“扒”三层皮", // 文字描述
        },
        {
          image: "https://s2.loli.net/2024/12/14/QRTe6wn39EaAfhK.png",
          link: "https://book.douban.com/review/12394214/",
          alt: "Slide 3",
          caption: "“失去”与“孤独”——《挪威的森林》的两大主题", // 文字描述
        },
      ],
      currentQuote: '', // 当前显示的格言
      weatherData: { // 保存天气相关数据
        date: '',
        week: '',
        weather:'',
        province: '',
        area: '',
        real: '',
        lowest: '',
        highest: '',
        wind: '',
        windsc: '',
        sunrise: '',
        sunset: '',
        tips: ''
      },
      weatherIcon:'',
      city: '101300501', // 默认城市101300501
      apiKey: 'f2b5fe8f9f22f260bad3a6ae82a9dc11', // 替换为你的APIKEY

    };
  },
  methods: {
    // 获取当前时间段（早上、下午、晚上）
    getTimeOfDay() {
      const hours = new Date().getHours();
      if (hours >= 6 && hours < 12) {
        return 'morning'; // 早上
      } else if (hours >= 12 && hours < 18) {
        return 'afternoon'; // 下午
      } else {
        return 'evening'; // 晚上
      }
    },

    // 获取格言
    async fetchNewQuote() {
      const timeOfDay = this.getTimeOfDay();
      let apiUrl = '';

      // 根据当前时间段决定调用哪个格言 API
      if (timeOfDay === 'morning') {
        apiUrl = 'https://apis.tianapi.com/zaoan/index';  // 早上的API
      } else if (timeOfDay === 'afternoon') {
        apiUrl = 'https://apis.tianapi.com/mingyan/index';  // 下午的API
      } else {
        apiUrl = 'https://apis.tianapi.com/wanan/index';  // 晚上的API
      }

      try {
        const response = await axios.get(apiUrl, {
          params: {
            key: 'f2b5fe8f9f22f260bad3a6ae82a9dc11',  // 替换为你自己的API KEY
          },
        });

        if (response.data && response.data.result) {
          // 如果是下午的格言，返回随机的格言和作者
          if (timeOfDay === 'afternoon' && response.data.result.list && response.data.result.list.length > 0) {
            const randomIndex = Math.floor(Math.random() * response.data.result.list.length);
            const quote = response.data.result.list[randomIndex];
            this.currentQuote = `${quote.content} —— ${quote.author}`;  // 显示内容和作者
          } else {
            this.currentQuote = response.data.result.content; // 早上或晚上的API返回单个格言
          }
        }else {
          this.currentQuote = "获取格言失败，请稍后再试。";
        }
      } catch (error) {
        console.error('获取格言失败:', error);
        this.currentQuote = "获取格言失败，请稍后再试。";
      }
    },

    // 获取当前天气
    async fetchWeather() {
      try {
        const weatherApiUrl = 'https://apis.tianapi.com/tianqi/index';
        const response = await axios.get(weatherApiUrl, {
          params: {
            key: this.apiKey,
            city: this.city, // 使用当前城市的天气
            type: '1', // 获取实时天气
          },
        });

        if (response.data && response.data.result) {
          const weatherData = response.data.result;
          this.weatherData = {
            date: weatherData.date,
            week: weatherData.week,
            weather: weatherData.weather,
            province: weatherData.province,
            area: weatherData.area,
            real: weatherData.real,
            lowest: weatherData.lowest,
            highest: weatherData.highest,
            wind: weatherData.wind,
            windsc: weatherData.windsc,
            sunrise: weatherData.sunrise,
            sunset: weatherData.sunset,
            tips: weatherData.tips
          };
          // 根据天气设置图标
          this.weatherIcon = this.getWeatherIcon(weatherData.weather);
        } else {
          this.weatherData.tips = "无法获取天气信息";
        }
      } catch (error) {
        console.error('获取天气失败:', error);
        this.weatherData.tips = '无法获取天气信息';
      }
    },
    getWeatherIcon(weather) {
      const weatherIcons = {
        "阴": yingtian, "晴": qingtian, "多云": duoyun, "暴雨": baoyu, "大雨": zhenyu, "中雨": xiaoyu,
        "小雨": xiaoyu, "阵雨": zhenyu, "雨": xiaoyu, "雷阵雨": leizhenyu, "大暴雨": baoyu, "特大暴雨": baoyu,
        "冻雨":yujiaxue, "小到中雨": zhenyu, "中到大雨": zhenyu, "大到暴雨": baoyu,
        "暴雪": baoxue, "大雪": baoxue, "中雪": zhongxue, "小雪": zhongxue, "雨夹雪": yujiaxue, "雪": zhongxue,
        "小到中雪": zhongxue, "中到大雪": zhongxue, "大到暴雪": baoxue, "冰雹": baoxue, "浮尘": fuchen,
        "扬沙": yangsha, "大雾": wu, "雾": wu,
      };
      return weatherIcons[weather] || "default-icon.png";
    }
  },
  mounted() {
    // 页面加载时获取天气信息
    this.fetchWeather();
    // 页面加载时获取初始格言
    this.fetchNewQuote();
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.01);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: bold;
  background-image: linear-gradient(45deg, #ff7e5f, #00ffff, #f680cf, #feb47b, #11AA0B);
  -webkit-background-clip: text;
  color: transparent;
  margin: 20px 0;
  background-size: 200% 200%;
  animation: gradient-animation 3s ease infinite;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: auto;  /* 让主容器自适应高度 */
  overflow: hidden;  /* 隐藏主容器的滚动条 */
}

.top-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.carousel-section {
  flex: 1;
}

.weather-container {
  flex: 1;
  background-color: #ffe4e6;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* 添加这一行，使图标相对于该容器定位 */
  height: 400px;
}

.weather-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
}

.weather-info {
  font-size: 1.2rem;
  color: #333;
}


.bottom-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  flex-direction: row-reverse; /* 反转顺序，图表和格言左右位置呼唤 */
  align-items: flex-start; /* 确保子元素对齐顶部 */
}

.quote-container {
  background-color: #fce4ec;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 50%;
  height: 400px;
  align-self: flex-start; /* 在父级 flex 布局中让该元素靠右 */
  margin-right: 0; /* 确保没有额外的间距 */
  margin-top: 20px; /* 确保从顶部开始对齐 */
  position: relative; /* 添加相对定位，为绝对定位的子元素提供参考 */
}
.quote {
  font-size: 1.4rem;
  font-family: 'Comic Sans MS', sans-serif;
  color: #e91e63;
}

.change-quote-btn {
  position: absolute; /* 绝对定位 */
  bottom: 20px; /* 距离容器底部20px */
  left: 15%; /* 按钮居中对齐 */
  margin-top: 10px;
  padding: 15px 30px; /* 增大按钮的内边距，增加按钮大小 */
  font-size: 18px; /* 增大按钮文字的字体大小 */
  background-color: #ff80ab;
  color: #fee5ff;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.change-quote-btn:hover {
  transform: scale(1.1);
}
.carousel-image {
  width: 100%;
  height: auto; /* 使图片占满容器 */
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.05);
}

.carousel-caption {
  position: absolute;
  left: 20px; /* 文字距离左侧的距离 */
  bottom: 20px; /* 文字距离底部的距离 */
  color: #00ffff;
  font-size: 1.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4); /* 减轻阴影效果 */
  background-color: rgba(0, 0, 0, 0.05); /* 半透明背景 */
  padding: 10px;
  border-radius: 5px;
}

* {
  box-sizing: border-box;
}
</style>
