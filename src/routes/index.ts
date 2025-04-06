import { createRouter, createWebHistory } from 'vue-router'

import Pokemon from '../pages/Pokemon.vue'
import PokemonSearch from '../pages/PokemonSearch.vue'

const routes = [
  { path: '/', component: PokemonSearch },
  { path: '/:pokemon', name: 'pokemon', component: Pokemon },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router