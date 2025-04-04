<template>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
        <div v-for="pokemon in list">
            <PokemonResult :pokemon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { PokemonListResource } from '../stores/search';
import PokemonResult from './PokemonResult.vue';

const props = defineProps<{
    list?: Array<PokemonListResource> | null
}>()

watch(props.list, () => {
    console.log(">>> List: ", props.list)
})

</script>