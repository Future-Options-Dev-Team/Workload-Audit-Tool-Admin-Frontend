<template>
  <div class="bg-white">
    <v-navigation-drawer v-model="drawer" app clipped class="bg-white">
      <template #prepend>
        <v-list-item two-line light>
          <v-list-item-avatar>
            <v-icon x-large>
              mdi-account-circle
            </v-icon>

          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>@{{ user.username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

      <v-divider class="bg-gray-100"></v-divider>
      </template>
      <div class="menu">
        <ul>
          <template  v-for="item in menuItems">
            <li :key="item.name" class="menu-item">
              <nuxt-link :to="item.to" :exact="item.exact">
                <span :class="`fe fe-${item.icon}`" /> {{ item.label }}
              </nuxt-link>
            </li>
        </template>
        </ul>
      </div>
    </v-navigation-drawer>

    <v-app-bar
      app
      light
      clipped-left
      elevation="1"
      color="white"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Workload Audit Tool - Administrator</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon color="orange darken-3">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn icon color="orange darken-3">
        <v-icon>mdi-message-text-outline</v-icon>
      </v-btn>

      <v-menu
        bottom
        left
        :close-on-content-click="false"
        :nudge-width="200"
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn
            light
            icon
            v-bind="attrs"
            v-on="on"
          >
          <v-avatar
            size="32px"
          >
            <v-icon color="orange darken-3">
              mdi-account-circle
            </v-icon>
          </v-avatar>
          </v-btn>
        </template>

        <div class="bg-white">
          <div class="py-2 px-4">
            <span class="text-gray-600 font-medium">{{ `${user.name}` }}</span>
            <span class="block text-gray-400 text-sm font-semibold">{{ user.email }}</span>
          </div>
          <span class="block border-b border-gray-200"></span>
          <nuxt-link
            :to="'/profile/me'"
            class="w-full hover:bg-gray-100 px-4 py-2 text-left text-sm flex items-center"
          >
            <v-icon small color="grey darken-2" class="mr-2">mdi-account</v-icon>
            <span class="text-gray-600">My account</span>
          </nuxt-link>
          <nuxt-link
            :to="'/profile/me'"
            class="w-full hover:bg-gray-100 px-4 py-2 text-left text-sm flex items-center"
          >
            <v-icon small color="grey darken-2" class="mr-2">mdi-lock-reset</v-icon>
            <span class="text-gray-600">Change password</span>
          </nuxt-link>
          <span class="block border-b border-gray-200"></span>
          <button
            class="w-full text-red-500 hover:bg-gray-100 px-4 py-2 text-left text-sm flex items-center"
            @click="logout"
          >
          <v-icon small color="red darken-1" class="mr-2">mdi-lock</v-icon>
            Logout
          </button>
        </div>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'TopBarNavigation',

  data() {
    return {
      user: this.$auth.user,
      menuItems: [
        { label: 'Home', name: 'home', to: '/', icon: 'home', exact: true },
        { label: 'Clients', name: 'client', to: '/clients', icon: 'users', exact: false },
        { label: 'Users', name: 'users', to: '/users', icon: 'users', exact: false },
        { label: 'Settings', name: 'settings', to: '/settings', icon: 'settings', exact: false }
      ],
      drawer: true,
      clipped: true
    }
  },

  methods: {
    logout() {
      this.$swal.fire({
        title: 'Please confirm!',
        text: 'Are you sure want to logout?',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!',
        preConfirm: () => {
          this.$auth.logout()
          this.$toast.success('You have logged out!')
        },
      }) 
    },
    onidle() {
      this.$auth.logout()
      this.$toast.success('You have been logged out because of no activity!')
    },
  }
}
</script>

<style lang="less" scoped>
.bg-primary {
  background-color: #f98d06;
  background: #E46805;
}

.border-primary {
  border-color: #E46805;
}
.menu {
  @apply p-2;
}

.menu ul {
  padding-left: 0;
}
.menu-item{
  @apply mt-0 outline-none;
  .fe{
    @apply mr-1 text-gray-400;
  }
  a{
    @apply block w-full text-sm font-medium text-gray-400 py-3 mr-5 px-3 mb-2;
  }
  a:hover{
    @apply text-white bg-primary no-underline mr-5 rounded;
  }
  a.nuxt-link-active{
    @apply text-sm text-white font-semibold bg-primary no-underline mr-5 rounded;
  }
  a:hover .fe, a.nuxt-link-active .fe {
    @apply text-white;
  }
}
</style>
