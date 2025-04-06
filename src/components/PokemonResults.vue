<template>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 mb-5">
        <div v-for="pokemon in advList">
            <PokemonResult :pokemon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { PokemonListResource } from '../stores/search';
import PokemonResult from './PokemonResult.vue';

import { useSearchStore } from '../stores/search';
import { storeToRefs } from 'pinia';

const { advList } = storeToRefs(useSearchStore())
const { getPokeData } = useSearchStore()

const props = defineProps<{
    list?: Array<PokemonListResource> | null
}>()

onMounted(() => {
    getPokemon(props.list)
})

const getPokemon = async (list: Array<PokemonListResource>) => {
    await getPokeData(list)
}

</script>