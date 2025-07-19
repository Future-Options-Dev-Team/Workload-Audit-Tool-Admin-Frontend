<template>
  <div>
    <div class="mt-5 flex items-center">
      <div>
        <span class="text-2xl text-gray-700 font-medium block">
          Settings
        </span>
        <p class="text-gray-400">All configurable sections of the tool live here</p>
      </div>
      <div class="ml-auto"></div>
    </div>

    <div class="grid grid-cols-3 gap-4 mt-5">
      <!-- <nuxt-link to="/settings/general" class="border border-gray-200 bg-white rounded-lg p-3 py-2 hover:border hover:border-blue-500">
        <span class="text-lg text-gray-600 font-semibold">General settings</span>
        <p class="text-gray-400">General institution configurations including security configurations </p>
      </nuxt-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage'
}
</script>
