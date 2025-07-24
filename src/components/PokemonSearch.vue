<template>
    <div class="form-control">
        <div class="relative">
            <input type="text" class="w-full pr-40 bg-gray-200 input input-lg text-black" placeholder="Search..." v-model="searchStr" />
            <button type="button" class="absolute top-0 right-0 rounded-l-none w-36 btn btn-primary btn-lg" @click="search">Search</button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useSearchStore, type PokemonListResource } from '../stores/search'
import { ref } from 'vue'

const { basicList } = storeToRefs(useSearchStore())
const searchStr = ref("")

const search = () => {
    if (searchStr.value.length >= 3) {
        let filtered = basicList.value.filter((pokemon) => {
            return pokemon.name.includes(searchStr.value.toLowerCase())
        })
        emit('filteredList', filtered)
    }
}

const emit = defineEmits<{
    (e: 'filteredList', filteredList: Array<PokemonListResource>) : void
}>()

</script>