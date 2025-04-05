<template>
    <div class="card bg-base-300 rounded-box grid grow place-items-center">
        <h1>{{ capitalized(pokemon?.data.name) }}</h1>
        <img :src=" pokemon.data.sprites.other['official-artwork'].front_default" />
    </div>
</template>

<script setup lang="ts">
import type { PokemonResource } from '../stores/search';

const props = defineProps<{
    pokemon?: PokemonResource | null
}>()

const capitalized = (name: string) => {
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