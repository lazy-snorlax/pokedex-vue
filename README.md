# Pokedex

This is a Pokedex created using Vue 3, Vite, Pinia, and the [PokeAPI](https://pokeapi.co/docs/v2). Styling is done by TailwindCSS and [DaisyUI](https://daisyui.com/)

### Cache
This implements a cache in the pinia store. When an api call to get a specific Pokemon happens, it is added to the cache and pulled from the cache when asked to re-fetch that data.
