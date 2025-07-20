<template>
    <div class="hero bg-base-200 max-h-screen sticky top-0 z-40">
        <div class="hero-content text-center">
            <div class="max-w-full">
                <h1 class="text-5xl font-bold">{{ capitalized(pokemon?.name) }}</h1>
                <RouterLink  :to="'/'" class="btn btn-primary">Back to Search</RouterLink>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 mx-5 mb-5">
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3">
            <div class="hero-content flex-col lg:flex-row">
                <img :src="`${pokemon?.sprites?.other['official-artwork']?.front_default ?? ''}`"
                class="max-w-sm rounded-lg" />
                <div>
                    <div class="py-3">
                        <span v-for="types in pokemon.types" class="text-3xl me-5">{{ capitalized(types.type?.name) }}</span>
                    </div>
                    <p class="py-1">Height: {{ pokemon.height / 10 }} m</p>
                    <p class="py-1">Weight: {{ pokemon.weight / 10 }} kg</p>
                    <p class="py-1">Species: {{ pokemon.species ? sanitize(pokemon.species?.name) : '' }}</p>
                </div>
            </div>
        </div>
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3">
            <h1 class="card-title text-3xl">Stats</h1>
            <div class="card-body">
                <template v-for="stat in pokemon.stats">
                    <p>
                        <span class="text-lg">{{ sanitize(stat.stat.name) }}: </span>
                        <span class="text-lg">{{ stat.base_stat }}</span>
                    </p>
                </template>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-8 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 mx-5 mb-5">
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
            <h1 class="card-title">Abilities</h1>
            <div class="card-body">
                <template v-for="ability in pokemon.abilities">
                    <h3 class="text-lg">{{ sanitize(ability.ability.name) }}
                        <span class="badge" v-if="ability.is_hidden">Hidden Ability</span>
                    </h3>
                </template>
            </div>
        </div>
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
            <h1 class="card-title">Sprites</h1>
            <div class="card-body">
                <div class="flex gap-2 justify-center">
                    <img :src="pokemon.sprites.front_default" alt="" class="w-30">
                    <img :src="pokemon.sprites.back_default" alt="" class="w-30">
                    <img :src="pokemon.sprites.front_shiny" alt="" class="w-30">
                    <img :src="pokemon.sprites.back_shiny" alt="" class="w-30">
                </div>
                <div class="flex gap-8 justify-center">
                    <img :src="pokemon.sprites.other.showdown?.front_default" alt="" class="w-30">
                    <img v-if="pokemon.sprites.other.showdown?.back_default" :src="pokemon.sprites.other.showdown?.back_default" alt="" class="w-30">
                    <img :src="pokemon.sprites.other.showdown?.front_shiny" alt="" class="w-30">
                    <img v-if="pokemon.sprites.other.showdown?.back_shiny" :src="pokemon.sprites.other.showdown?.back_shiny" alt="" class="w-30">
                </div>
            </div>
        </div>
        <div v-if="pokemon.held_items?.length > 0" class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
            <h1 class="card-title">Held Items</h1>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Rarirty</th>
                            <th>Location Area</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in pokemon.held_items" :key="index">
                            <td>{{ sanitize(item.item.name) }}</td>
                            <td>
                                <template v-for="(version, idx) in item.version_details">
                                    <span>{{ version.rarity }}</span>
                                    <span class="ms-1 me-4 badge">{{ sanitize(version.version.name) }}</span>
                                </template>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
            <h1 class="card-title">Moves</h1>
            <div class="card-body">
                <div role="tablist" class="tabs tabs-lift text-center">
                    
                    <template v-for="(methodGroups, versionGroupName) in groupedMoves">
                        <input type="radio" name="move_version_tabs" class="tab" :aria-label="sanitize(versionGroupName)" :checked="`${versionGroupName ? 'checked' : ''}`">
                        <div class="tab-content">

                            <div role="tablist" class="inner-tabs tabs tabs-lift">
                                <template v-for="(moves, methodName) in methodGroups">
                                    <input type="radio" :name="`move_learn_method_tabs_${ versionGroupName }`" class="tab" :aria-label="sanitize(methodName)" :checked="methodName === 'level-up' ?? 'checked'">
                                    <div class="tab-content">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Move</th>
                                                    <th>Learned At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(move, index) in moves" :key="index">
                                                    <td>{{ sanitize(move.move) }}</td>
                                                    <td>
                                                        {{ move.level_learned_at > 0 ? move.level_learned_at : '' }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </template>
                            </div>

                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue';
import { useSearchStore } from '../stores/search';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute()

const { pokemon } = storeToRefs(useSearchStore())
const { getPokemon } = useSearchStore()

onMounted(async () => {
    await getPokemon(route.params.pokemon)
})

const capitalized = (name: string) => {
    if (name.includes("mega") || name.includes("gmax")) {
        return sanitize(name)
    } else {
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
}
const sanitize = (name: string) => {
    if (name == undefined) {
        return ''
    }
    let words = name.split("-")
    let newWord = ""
    words.forEach(word => {
        newWord += word.charAt(0).toUpperCase() + word.slice(1) + " "
    });
    return newWord.trim()
}

const learnTypes = ['tutor', 'level-up', 'machine'];

const groupedMoves = computed(() => {
    let grouped = pokemon?.value.moves?.reduce((group, currentMove) => {
        currentMove.version_group_details.forEach(detail => {
            const versionGroupName = detail.version_group.name;
            const methodName = detail.move_learn_method.name;

            // Initialize version group if it doesn't exist
            if (!group[versionGroupName]) {
                group[versionGroupName] = {};
            }

            // Initialize method group inside the version group if it doesn't exist
            if (!group[versionGroupName][methodName]) {
                group[versionGroupName][methodName] = [];
            }

            // Add the move with details
            group[versionGroupName][methodName].push({
                move: currentMove.move.name,
                url: currentMove.move.url,
                level_learned_at: detail.level_learned_at,
            });
        });
    
        return group;
    }, {})

    // Sort moves in each method group by level_learned_at
    for (const version in grouped) {
        for (const method in grouped[version]) {
            if (method === 'level-up') {
                // Sort by level
                grouped[version][method].sort(
                    (a, b) => a.level_learned_at - b.level_learned_at
                );
            } else if (method === 'machine' || method === 'tutor') {
                // Sort alphabetically by move name
                grouped[version][method].sort((a, b) =>
                    a.move.localeCompare(b.move)
                );
            }
        }
    }
    console.log(">>>> grouped moves: ", grouped)
    return grouped;
})
</script>