<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal modal-open" @click.self="handleClose">
        <div class="modal-box animate-fade-in">
          <h3 class="font-bold text-lg text-error mb-2">发生错误</h3>
          <p class="py-2">{{ message }}</p>
          <div class="modal-action">
            <button class="btn btn-error btn-sm" @click="handleClose">关闭</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  show: Boolean,
  message: {
    type: String,
    default: '发生错误，请重试'
  },
  minShowTime: {
    type: Number,
    default: 800 // ms，最短显示时间，防止跳闪
  }
})
const emit = defineEmits(['close'])

const visible = ref(false)
let showTimer = null
let hideTimer = null
let showStart = 0

watch(() => props.show, (val) => {
  if (val) {
    visible.value = true
    showStart = Date.now()
  } else if (visible.value) {
    const elapsed = Date.now() - showStart
    const remain = Math.max(0, props.minShowTime - elapsed)
    hideTimer = setTimeout(() => {
      visible.value = false
    }, remain)
  }
})

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.animate-fade-in {
  animation: fadeInModal 0.25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.95);}
  to { opacity: 1; transform: scale(1);}
}
</style>