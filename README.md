# Pokedex

This is a Pokedex created using Vue 3, Vite, Pinia, and the [PokeAPI](https://pokeapi.co/docs/v2). Styling is done by TailwindCSS and [DaisyUI](https://daisyui.com/)

### Cache
This uses a cache in the pinia store. When an api call to get a specific Pokemon happens, it is added to the cache and pulled from the cache when asked to re-fetch that data.

This may result in performace issues in the browser. Currently working on a fix to routinely clear elements in the cache after set amount of time.
