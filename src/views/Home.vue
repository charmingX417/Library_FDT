<template>
  <div class="home">
    <h2 class="gradient-text">纵使诗千行百般长，亦不及我念你铿锵</h2>
    <div class="carousel-wrapper">
      <el-carousel
          :interval="5000"
          height="400px"
          width="738px"
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
  </div>
</template>

<script>
export default {
  name: "Home",
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
    };
  },
  methods: {
    isValidImageUrl(url) {
      return url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg'));  // 判断 URL 后缀
    }
  }
};
</script>

<style scoped>
.home {
  width: 100%;
  height: auto;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center; /* 保证标题居中 */
  padding: 20px;
  overflow-x: hidden; /* 禁止水平滚动条 */
}

h2.gradient-text {
  font-size: 2.5rem;
  font-weight: bold;
  background-image: linear-gradient(45deg, #ff7e5f, #00ffff, #f680cf, #feb47b, #11AA0B); /* 渐变色，增加颜色对比 */
  -webkit-background-clip: text; /* 背景裁剪为文本 */
  color: transparent; /* 使文本本身变为透明，展示渐变 */
  margin: 20px 0;
  background-size: 200% 200%; /* 背景大小设大以增强渐变效果 */
  animation: gradient-animation 3s ease infinite; /* 添加动画平滑渐变 */
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

.carousel-wrapper {
  width: 100%; /* 确保轮播图宽度正确 */
  display: flex;
  justify-content: flex-start; /* 使轮播图左对齐 */
  padding-top: 20px; /* 给轮播容器顶部添加一些间距 */
  overflow-x: hidden; /* 禁止水平滚动条 */
}

.el-carousel {
  width: 738px; /* 设置轮播容器宽度为778px */
}

.slide-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative; /* 为了定位文字 */
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

/* 文字样式 */
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
