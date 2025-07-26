<template>
  <div class="hero bg-base-200 max-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-full">
        <h1 class="text-5xl font-bold">Pokedex Search</h1>
        <p class="py-6">
          Type at least 3 letters to begin a search
        </p>
        <div class="rounded-box grid h-20 place-items-center">
          <div class="form-control">
            <div class="relative">
              <input type="text" class="w-full pr-40 bg-gray-200 input input-lg text-black" placeholder="Search..." v-model="searchInput" @change="search" />
              <button type="button" class="absolute top-0 right-0 rounded-l-none w-36 btn btn-primary btn-lg">Search</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto max-h-full mt-4">
    <PokemonResults :list="store.filteredList" v-if="store.filteredList.length > 0" :key="store.filteredList.length * Math.floor(Math.random()*10)" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import PokemonResults from '../components/PokemonResults.vue';
import { useSearchStore } from '../stores/search';

const store = useSearchStore()
const searchInput = ref("")

const search = (async () => {
  await store.searchPokemon(searchInput.value)
  await store.getPokeData(store.filteredList)
})

</script>
  