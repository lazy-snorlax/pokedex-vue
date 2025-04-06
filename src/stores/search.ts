import axios from "axios";
import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        basicList: [],
        advList: [],
        cache: {}
    }),
    actions: {
        async getAllPokemon() {
            await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=10500")
            .then(response => {
                this.basicList = response.data.results
            })
        },

        async getPokeData(filtered: Array<PokemonListResource>) {
            this.advList = []; // Reset advList to blank
            let promises = [];
            
            filtered.forEach(result => {
                // Only pull pokemon not in cache
                if (this.cache[result.name] === undefined) {
                    promises.push(axios.get(result.url))
                } else {
                    this.advList.push(this.cache[result.name])
                }
            })
            console.log(">>> promises: ", promises, promises.length)
            // Pull only pokemon not already in cache
            if (promises.length > 0) {
                Promise.all(promises).then(response => {
                    let respArr = response
                    // Add to advList & cache
                    respArr.forEach(resp => {
                        console.log(">>> resp: ", resp?.data.name)
                        this.cache[resp?.data.name] = resp?.data
                        this.advList.push(this.cache[resp?.data.name])
                    })
                    console.log(">>> Cache: ", this.cache)
                })
            }
        }
    }
})

type SearchState = {
    basicList: Array<PokemonListResource>,
    advList: Array<PokemonResource>,
    cache: {
        [key: string]: PokemonResource
    },
}

export type PokemonListResource = {
    name: string,
    url: string
}

export type PokemonResource = {
    name: string | undefined
    url: string
    sprites: {
        front_default: string
        other: {
            [key: string]: {
                front_default: string
            }
        }
    }
}