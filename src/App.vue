<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense :timeout="0">
            <component :is="Component" />
          </Suspense>
        </template>
    </RouterView>
</template>

<script lang="ts" setup>
window.document.title = import.meta.env.VITE_APP_TITLE

import { onMounted } from 'vue';
import { useSearchStore } from './stores/search';

const store = useSearchStore()

onMounted(() => { store.getAllPokemon() })

</script>
