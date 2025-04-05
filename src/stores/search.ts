import axios from "axios";
import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        basicList: [],
        advList: [],
    }),
    actions: {
        async getAllPokemon() {
            await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=10500")
            .then(response => {
                this.basicList = response.data.results
            })
        },

        async getPokeData(filtered: Array<PokemonListResource>) {
            let promises = filtered.map(result => {
                return axios.get(result.url)
            })
            Promise.all(promises).then(response => {
                this.advList = response
            })
        }
    }
})

type SearchState = {
    basicList: Array<PokemonListResource>,
    advList: Array<PokemonResource>,
}

export type PokemonListResource = {
    name: string,
    url: string
}

export type PokemonResource = {
    name: string
    url: string
    sprites: {
        front_default: string
    }
}