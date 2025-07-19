<template>
  <v-app light>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container>
        <div id="scroll-target">
          <Nuxt />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'SurveyLayout',
}
</script>
