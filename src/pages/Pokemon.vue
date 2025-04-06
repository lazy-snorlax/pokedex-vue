<template>
    <!-- <div class="hero bg-base-200 max-h-screen"></div> -->
    <div class="container mx-auto">
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3">
            <div class="hero-content flex-col lg:flex-row">
                <img
                :src=" pokemon?.sprites.other['official-artwork'].front_default"
                class="max-w-sm rounded-lg" />
                <div>
                    <h1 class="text-5xl font-bold">{{ capitalized(pokemon?.name) }}</h1>
                    <div class="py-3">
                        <span v-for="types in pokemon.types" class="me-5">{{ capitalized(types.type.name) }}</span>
                    </div>
                    <p class="py-1">Height: {{ pokemon.height / 10 }} m</p>
                    <p class="py-1">Weight: {{ pokemon.weight / 10 }} kg</p>
                </div>
            </div>
        </div>
        <div class="container mx-auto">
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3">
                <h1 class="card-title">Abilities</h1>
                <div class="card-body">
                    <template v-for="ability in pokemon.abilities">
                        <h3 class="text-lg">{{ capitalized(ability.ability.name) }}
                            <span class="badge" v-if="ability.is_hidden">Hidden Ability</span>
                        </h3>
                    </template>
                </div>
            </div>
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3">
                <h1 class="card-title">Stats</h1>
                <div class="card-body">
                    <template v-for="stat in pokemon.stats">
                        <p>
                            <span class="text-lg">{{ capitalized(stat.stat.name) }}: </span>
                            <span class="text-lg">{{ stat.base_stat }}</span>
                        </p>
                    </template>
                </div>
            </div>
        </div>
        <!-- <div class="grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 mb-5"></div> -->
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useSearchStore } from '../stores/search';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute()

const { pokemon } = storeToRefs(useSearchStore())
const { getPokemon } = useSearchStore()

onBeforeMount(async () => {
    await getPokemon(route.params.pokemon)
})

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