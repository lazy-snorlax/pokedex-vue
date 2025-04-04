<template>
  <div class="hero bg-base-200 max-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-full">
        <h1 class="text-5xl font-bold">Pokedex Search</h1>
        <p class="py-6">
          Enter a Pokemon to lookup
        </p>
        <div class="rounded-box grid h-20 place-items-center">
          <PokemonSearch />
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto max-h-full">
    <PokemonResults :list=results.list />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PokemonResults from './components/PokemonResults.vue';
import PokemonSearch from './components/PokemonSearch.vue';

import { useSearchStore } from './stores/search';
import { onMounted } from 'vue';
const { results } = storeToRefs(useSearchStore())
const { getAllPokemon } = useSearchStore()

onMounted(() => {
  getPokemon()
})

const getPokemon = async () => {
  await getAllPokemon()
}


</script>
