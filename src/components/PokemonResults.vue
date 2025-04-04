<template>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-9 lg:grid-cols-6 md:grid-cols-3">
        <div v-for="pokemon in list">
            <div class="card bg-base-300 rounded-box grid grow place-items-center">
                <h1>{{ pokemon?.name }}</h1>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    list?: Array<Object> | null
}>()

</script>