<template>
  <div class="flex items-center gap-1">
    <RouterLink :to="{ name: 'pokemon', params: { pokemon: stage.species } }">
      <img :src="stage.sprite" :alt="stage.species" class="w-30" />
    </RouterLink>
    <div>
      <RouterLink :to="{ name: 'pokemon', params: { pokemon: stage.species } }">
        <strong>{{ capitalized(stage.species) }}</strong>
      </RouterLink>
      <br />
      <em>{{ stage.evolutionInfo }}</em>
    </div>
  </div>

  <EvolutionStage v-if="stage.evolvesTo.length > 0" v-for="child in stage.evolvesTo" :key="child.species" :stage="child" />
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

const capitalized = (name: string = "") => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
</script>
