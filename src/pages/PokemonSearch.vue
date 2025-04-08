<template>
    <div class="hero bg-base-200 max-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-full">
          <h1 class="text-5xl font-bold">Pokedex Search</h1>
          <p class="py-6">
            Type at least 3 letters to begin a search
          </p>
          <div class="rounded-box grid h-20 place-items-center">
            <PokemonSearch @filtered-list="filterResults" />
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto max-h-full mt-4">
      <PokemonResults :list="pokeList" v-if="pokeList.length > 0" :key="pokeList.length * Math.floor(Math.random()*10)" />
    </div>
  </template>
  
  <script setup lang="ts">
  import PokemonResults from '../components/PokemonResults.vue';
  import PokemonSearch from '../components/PokemonSearch.vue';
  
  import { useSearchStore, type PokemonListResource } from '../stores/search';
  import { onMounted, ref } from 'vue';
  const { getAllPokemon } = useSearchStore()
  
  const pokeList = ref<PokemonListResource[]>([])
  
  onMounted(() => {
    getPokemon()
  })
  
  const getPokemon = async () => {
    await getAllPokemon()
  }
  
  const filterResults = (filtered: Array<PokemonListResource>) => {
    pokeList.value = filtered
  }
  
  </script>
  