<template>
    <div class="card bg-base-300 rounded-box grid grow place-items-center pb-3">
        <h1>
            {{ capitalized(pokemon?.species?.name) }} 
            <span v-if="pokemon?.name.includes('-')">({{ pokemon?.name.split('-')[1].toUpperCase() }})</span>

        </h1>
        <img :src=" pokemon?.sprites.other['official-artwork'].front_default" />
        <RouterLink :to="{ name: 'pokemon', params: { pokemon: pokemon?.name } }" class="btn btn-primary">Open</RouterLink>
    </div>
</template>

<script setup lang="ts">
import type { PokemonResource } from '../stores/search';

const props = defineProps<{
    pokemon?: PokemonResource | null
}>()

const capitalized = (name: string = '') => {
    if (name.includes("mega") || name.includes("gmax")) {
        let words = name.split("-")
        let newWord = ""
        words.forEach(word => {
            newWord += word.charAt(0).toUpperCase() + word.slice(1) + " "
        });
        return newWord
    } else {
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
}

</script>