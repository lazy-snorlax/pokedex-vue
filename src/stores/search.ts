import axios from "axios";
import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        pokemon: null,
        results: {
            list: []
        }
    }),
    actions: {
        async getAllPokemon() {
            const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=50")
            this.results.list = response.data.results
            console.log(">>> getALlPokemon:", response.data.results, this.results.list)
        }
    }
})

type SearchState = {
    pokemon: PokemonResource | null,
    results: {
        list: Array<PokemonResource>,
    }
}

export type PokemonResource = {}