<template>
  <div class="hero bg-base-200 max-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-full">
        <h1 class="text-5xl font-bold">Pokedex Search</h1>
        <p class="py-6">
          Enter a Pokemon to lookup
        </p>
        <div class="rounded-box grid h-20 place-items-center">
          <PokemonSearch @filtered-list="filterResults" />
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="container mx-auto max-h-full">
    <PokemonResults :list="pokeList" v-if="pokeList.length > 0" :key="pokeList.length * Math.floor(Math.random()*10)" />
  </div>
</template>

<script setup lang="ts">
import PokemonResults from './components/PokemonResults.vue';
import PokemonSearch from './components/PokemonSearch.vue';

import { useSearchStore } from './stores/search';
import { onMounted, ref } from 'vue';
const { getAllPokemon } = useSearchStore()

const pokeList = ref([])

onMounted(() => {
  getPokemon()
})

const getPokemon = async () => {
  await getAllPokemon()
}

const filterResults = (filtered: Array<Object>) => {
  pokeList.value = filtered
}

</script>
