<template>
  <li>
    <div style="display: flex; align-items: center; gap: 1rem;">
      <img :src="stage.sprite" :alt="stage.species" width="80" />
      <div>
        <strong>{{ stage.species }}</strong><br />
        <em>{{ stage.evolutionInfo }}</em>
      </div>
    </div>

    <ul v-if="stage.evolvesTo.length > 0" style="margin-left: 2rem;">
      <EvolutionStage v-for="child in stage.evolvesTo" :key="child.species" :stage="child" />
    </ul>
  </li>
</template>

<script lang="ts" setup>
defineProps<{
  stage: {
    species: string
    sprite: string
    evolutionInfo: string
    evolvesTo: any[]
  }
}>()
</script>
