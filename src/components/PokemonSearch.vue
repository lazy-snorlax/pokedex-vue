<template>
    <div class="form-control">
        <div class="relative">
            <input type="text" class="w-full pr-40 bg-gray-200 input input-lg text-black" placeholder="Search..." @change=handleChange />
            <button type="button" class="absolute top-0 right-0 rounded-l-none w-36 btn btn-primary btn-lg">Search</button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useSearchStore, type PokemonListResource } from '../stores/search'

const { basicList } = storeToRefs(useSearchStore())

const handleChange = (e: Event) => {
    let searchStr = e.target?.value

    if (searchStr.length >= 3) {
        let filtered = basicList.value.filter((pokemon) => {
            return pokemon.name.includes(searchStr)
        })
        emit('filteredList', filtered)
    }
}

const emit = defineEmits<{
    (e: 'filteredList', filteredList: Array<PokemonListResource>) : void
}>()

</script>