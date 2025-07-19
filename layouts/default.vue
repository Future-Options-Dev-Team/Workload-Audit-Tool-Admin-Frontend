<template>
  <v-app light>
    <top-bar-navigation />

    <!-- Sizes your content based upon application components -->
    <v-main class="bg-gray-100 overflow-x-auto">

      <!-- Provides the application the proper gutter -->
      <v-container class="overflow-x-auto">
        <div id="scroll-target">
          <Nuxt />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopBarNavigation from '~/components/ui/TopBarNavigation.vue'
export default {
  name: 'DefaultLayout',

  components: { TopBarNavigation }
}
</script>
