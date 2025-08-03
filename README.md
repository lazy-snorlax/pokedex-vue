# Pokedex

This is a Pokedex created using Vue 3, Vite, Pinia, and the [PokeAPI](https://pokeapi.co/docs/v2). Styling is done with TailwindCSS and [DaisyUI](https://daisyui.com/)

### Cache
This applictaion uses the IndexedDB of the browser as a cache. When a call for a Pokemon, Move or Ability is made, the app will cache it and pull from that store until the entry expires (set at 1 day for now). If your browser is experiencing performance issues, clearing this store could be helpful.
