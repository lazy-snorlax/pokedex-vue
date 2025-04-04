<template>
    <div class="card bg-base-300 rounded-box grid grow place-items-center">
        <h1>{{ capitalized(pokemon?.data.name) }}</h1>
        <img :src=pokemon?.data.sprites.front_default />
    </div>
</template>

<script setup lang="ts">
import type { PokemonResource } from '../stores/search';

const props = defineProps<{
    pokemon?: PokemonResource | null
}>()

const capitalized = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

</script>