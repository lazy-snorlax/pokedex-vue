<template>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 mb-5">
        <div v-for="pokemon in advList">
            <PokemonResult :pokemon />
        </div>
    </div>
</template>

<script setup lang="ts">
import PokemonResult from './PokemonResult.vue';
import { useSearchStore } from '../stores/search';
import { storeToRefs } from 'pinia';

const { advList } = storeToRefs(useSearchStore())
</script>