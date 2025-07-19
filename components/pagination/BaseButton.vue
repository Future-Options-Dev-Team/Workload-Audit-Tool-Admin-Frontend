<template>
  <li
    v-show="!disabled"
    class="mx-2 cursor-pointer border border-blue-700 px-3 text-blue-700 rounded text-xl hover:shadow"
  >
    <slot />
  </li>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
