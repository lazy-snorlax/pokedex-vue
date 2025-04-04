import axios from "axios";
import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        basicList: [],
        advList: [],
    }),
    actions: {
        async getAllPokemon() {
            await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=151")
            .then(response => {
                this.basicList = response.data.results
                let promises = this.basicList.map(result => {
                    return axios.get(result.url)
                })
                Promise.all(promises).then(response => {
                    this.advList = response
                })
            })
            // this.list.forEach(pokemon => {
            //     this.results[pokemon?.name] = this.fetchPokemonData(pokemon)
            // })
            console.log(">>> getAllPokemon:", this.basicList, this.advList)
        },
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