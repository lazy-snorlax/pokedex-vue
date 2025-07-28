<template>
    <template v-if="isLoading">
        <div class="grid place-items-center h-screen">
            <span class="loading loading-spinner loading-xl text-center"></span>
        </div>
    </template>
    <template v-else>
        <div class="hero bg-base-200 max-h-screen sticky top-0 z-40">
            <div class="hero-content text-center">
                <div class="max-w-full">
                    <h1 class="text-5xl font-bold">
                        {{ capitalized(pokemon?.species?.name) }} 
                        <span v-if="pokemon?.name.includes('-')">({{ pokemon?.name.split('-')[1].toUpperCase() }})</span>
                    </h1>
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
                <h1 class="card-title text-3xl">Base Stats</h1>
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
            <!-- Abilities -->
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
                <h1 class="card-title">Abilities</h1>
                <div class="card-body">
                    <template v-for="ability in pokemon.abilities">
                        <h3 class="text-lg">{{ sanitize(ability.ability.name) }}
                            <span class="badge" v-if="ability.is_hidden">Hidden Ability</span>
                        </h3>
                        <p>{{ ability.ability.flavor_text?.filter((text: any) => text.language.name === "en").pop().flavor_text }}</p>
                    </template>
                </div>
            </div>

            <!-- Evolutions -->
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
                <h3 class="card-title">Evolution Chain</h3>
                <div class="grid grid-cols-1 gap-2 mx-5 mb-5">
                    <template v-for="evo in pokemon.evolutionChain" :key="evo.species">
                        <EvolutionStage :stage="evo" />
                    </template>
                </div>
            </div>

            <!-- Sprites -->
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
                <h1 class="card-title">Sprites</h1>
                <div class="card-body">
                    <div class="flex gap-2 justify-center">
                        <img v-if="pokemon.sprites.front_default" :src="pokemon.sprites.front_default" alt="" class="w-30">
                        <img v-if="pokemon.sprites.back_default" :src="pokemon.sprites.back_default" alt="" class="w-30">
                        <img v-if="pokemon.sprites.front_shiny" :src="pokemon.sprites.front_shiny" alt="" class="w-30">
                        <img v-if="pokemon.sprites.back_shiny" :src="pokemon.sprites.back_shiny" alt="" class="w-30">
                    </div>
                    <div class="flex gap-8 justify-center">
                        <img :src="pokemon.sprites.other.showdown?.front_default" alt="" class="w-30">
                        <img v-if="pokemon.sprites.other.showdown?.back_default" :src="pokemon.sprites.other.showdown?.back_default" alt="" class="w-30">
                        <img :src="pokemon.sprites.other.showdown?.front_shiny" alt="" class="w-30">
                        <img v-if="pokemon.sprites.other.showdown?.back_shiny" :src="pokemon.sprites.other.showdown?.back_shiny" alt="" class="w-30">
                    </div>
                </div>
            </div>

            <!-- Items -->
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

            <!-- Moves -->
            <div class="card bg-base-300 rounded-box grid grow place-items-center mb-3 pt-3">
                <h1 class="card-title">Moves</h1>
                <div class="card-body">
                    <div role="tablist" class="tabs tabs-lift text-center">
                        
                        <template v-for="(methodGroups, versionGroupName) in groupedMoves">
                            <input type="radio" name="move_version_tabs" class="tab" :aria-label="sanitize(versionGroupName)" :checked="`${versionGroupName ? 'checked' : ''}`">
                            <div class="tab-content">

                                <div role="tablist" class="inner-tabs tabs tabs-lift">
                                    <span class="tab w-[calc((100vw-200px)/2)]">&nbsp;</span>
                                    <template v-for="(moves, methodName) in methodGroups">
                                        <input type="radio" :name="`move_learn_method_tabs_${ versionGroupName }`" class="tab" :aria-label="sanitize(methodName)" :checked="methodName === 'level-up' ?? 'checked'">
                                        <div class="tab-content">
                                            <table class="table table-fixed table-pin-cols">
                                                <thead>
                                                    <tr class="h-1/2">
                                                        <th class="w-1/10">Move</th>
                                                        <th class="w-1/10">Type</th>
                                                        <th class="w-1/10">Power</th>
                                                        <th class="w-1/10">Accuracy</th>
                                                        <th class="w-1/10">Damage</th>
                                                        <th class="w-1/10">Learned At</th>
                                                        <th >Effect</th>
                                                        <th >Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(move, index) in moves" :key="index">
                                                        <td class="text-center">{{ sanitize(move.move) }}</td>
                                                        <td :class="move.type?.name" class="text-center">{{ sanitize(move.type?.name) }}</td>
                                                        <td class="text-center">{{ move.power ?? '-' }}</td>
                                                        <td class="text-center">{{ move.accuracy ?? '-' }}</td>
                                                        <td :class="move.damage_class != 'status' ? move.damage_class : 'status-type'">{{ sanitize(move.damage_class) }}</td>
                                                        <td class="text-center">
                                                            {{ methodName === 'level-up' ? move.level_learned_at : '' }}
                                                        </td>
                                                        <td class="overflow-x-auto">{{ move.effect ?? '-' }}</td>
                                                        <td>{{ move.flavor_text ?? '-' }}</td>
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
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useSearchStore } from '../stores/search';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import EvolutionStage from '../components/EvolutionStage.vue';

const route = useRoute()

const { pokemon, isLoading } = storeToRefs(useSearchStore())
const store = useSearchStore()

const loadPokemon = async () => {
    isLoading.value = true
    await store.getPokemon(route.params.pokemon)
    await store.getAbilities()
    await store.getMoves()
    await store.getEvoChain()
    setTimeout(() => {
        isLoading.value = false
    }, 1000)
}

onMounted(async () => {
    await loadPokemon()
})

watch(() => route.params.pokemon, loadPokemon)

const capitalized = (name: string = "") => {
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

const groupedMoves = computed(() => {
    const methodOrder = ['level-up', 'machine', 'tutor' ];

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

            // console.log(">>> Version: ", versionGroupName, currentMove, currentMove.flavor_text.filter((flavor) => flavor.version_group.name === versionGroupName && flavor.language.name === "en").pop())

            // Add the move with details
            group[versionGroupName][methodName].push({
                move: currentMove.move.name,
                power: currentMove.power,
                accuracy: currentMove.accuracy,
                pp: currentMove.pp,
                type: currentMove.type,
                damage_class: currentMove.damage_class,
                level_learned_at: detail.level_learned_at,
                flavor_text: (currentMove.flavor_text?.filter((flavor) => flavor.version_group.name === versionGroupName && flavor.language.name === "en").pop())?.flavor_text,
                effect: (currentMove.effect_entries?.filter((effect) => effect.language.name === "en").pop())?.effect
            });
        });
    
        return group;
    }, {})

    // Sort moves in each method group by level_learned_at
    for (const version in grouped) {
        const orderedMethods = {};

        methodOrder.forEach(method => {
            if (grouped[version][method]) {
                if (method === 'level-up') {
                    grouped[version][method].sort(
                        (a, b) => a.level_learned_at - b.level_learned_at
                    );
                } else {
                    grouped[version][method].sort((a, b) =>
                        a.move.localeCompare(b.move)
                    );
                }
                orderedMethods[method] = grouped[version][method];
            }
        });
        grouped[version] = orderedMethods;
    }
    console.log(">>>> grouped moves (ordered): ", grouped)
    return grouped;
})
</script>

<style scoped>
.physical {
    background: radial-gradient(yellow, yellow, red, red);
    color: black;
    text-align: center;
}
.special {
    background: radial-gradient(indigo,indigo, navy);
    text-align: center;
}
.status-type {
    background: radial-gradient(grey, grey, white);
    text-align: center;
}

.fighting { background-color: brown; color: white;}
.normal { background-color: lightgray; color: black;}
.fire { background-color: red; color: white;}
.water { background-color: blue; color: white;}
.grass { background-color: green; color: white;}
.electric { background-color: yellow; color: black;}
.ice { background-color: skyblue; color: white;}
.bug { background-color: rgb(112, 163, 45); color: white;}
.ground { background-color: tan; color: white;}
.steel { background-color: grey; color: white;}
.dark { background-color: #0f0f0f; color: white;}
.poison { background-color: blueviolet; color: white;}
.rock { background-color: #af9748; color: white;}
.ghost { background-color: rgb(37, 0, 78); color: white;}
.flying { background: rgb(73, 131, 165); color: white;}
.psychic { background-color: rgb(238, 122, 142); color: white;}
.fairy { background-color: rgb(255, 150, 224); color: white;}
.dragon { background-color: rgb(43, 0, 145); color: white;}


</style>