<template>
  <div>
    <transition name="slide">
      <v-overlay v-if="open" :opacity="0.5" light>
        <div v-if="open" class="relative">
          <div :style="`width: ${width}`" class="detail-container relative bg-white">
            <button :style="`right: ${width}`" class="bg-primary hover:bg-blue-600 rounded-l-full py-2 px-3 close-button" @click="$emit('close')">
              <v-icon>mdi-close</v-icon>
            </button>

            <slot />
          </div>
        </div>
      </v-overlay>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',

  props: {
    width: {
      type: String,
      default: '800px'
    },
    open: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
.detail-container {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  height: auto;
  z-index: 999;
  overflow: scroll;
}

.close-button {
  position: fixed;
  top: 20px;
  z-index: 999;
}

.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-enter, .slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(150px);
  opacity: 0;
}

</style>
