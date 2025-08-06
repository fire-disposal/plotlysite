<template>
  <div class="about-hero min-h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-2xl shadow-lg p-10 relative overflow-hidden">
    <div class="absolute animate-float-slow left-[-60px] top-[-60px] w-40 h-40 bg-primary opacity-10 rounded-full blur-2xl"></div>
    <div class="absolute animate-float-fast right-[-40px] bottom-[-40px] w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl"></div>
    <div class="z-10 text-center">
      <h1 class="text-5xl font-extrabold text-primary drop-shadow mb-4 animate-fade-in">文献计量学分析平台</h1>
      <p class="text-lg text-base-content/80 mb-6 animate-fade-in-delay">
        探索和分析医学影像深度学习文献的综合平台。<br>
        基于文献计量学数据，提供多维度的研究洞察和可视化分析。
      </p>
      <div class="flex flex-wrap justify-center gap-4 mt-6">
        <div class="feature-card animate-fade-in-delay2">
          <span class="icon text-3xl">📊</span>
          <div class="title">多维数据可视化</div>
        </div>
        <div class="feature-card animate-fade-in-delay3">
          <span class="icon text-3xl">🔎</span>
          <div class="title">智能筛选与检索</div>
        </div>
        <div class="feature-card animate-fade-in-delay4">
          <span class="icon text-3xl">✨</span>
          <div class="title">高质量研究洞察</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-hero {
  animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
  transition: box-shadow 0.3s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-20px);}
}
@keyframes floatFast {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(30px);}
}
.animate-float-slow {
  animation: floatSlow 6s ease-in-out infinite;
}
.animate-float-fast {
  animation: floatFast 3.5s ease-in-out infinite;
}
.animate-fade-in {
  animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
}
.animate-fade-in-delay {
  animation: fadeInUp 1.2s cubic-bezier(0.4,0,0.2,1);
}
.animate-fade-in-delay2 {
  animation: fadeInUp 1.6s cubic-bezier(0.4,0,0.2,1);
}
.animate-fade-in-delay3 {
  animation: fadeInUp 2s cubic-bezier(0.4,0,0.2,1);
}
.animate-fade-in-delay4 {
  animation: fadeInUp 2.4s cubic-bezier(0.4,0,0.2,1);
}
.feature-card {
  background: rgba(255,255,255,0.85);
  border-radius: 1rem;
  box-shadow: 0 2px 16px 0 rgba(80,80,180,0.08);
  padding: 1.5rem 2.5rem;
  min-width: 120px;
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer;
}
.feature-card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 6px 32px 0 rgba(80,80,180,0.16);
}
.feature-card .title {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #6366f1;
  font-size: 1.1rem;
}
</style>