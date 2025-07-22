import axios from "axios";
import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        basicList: [],
        advList: [],
        cache: {},
        pokemon: {
            name: "",
            url: "",
            sprites: {
                front_default: "",
                other: {}
            }
        }
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
            let promises = []; // Init empty promise array
            
            filtered.forEach(result => {
                // Only pull pokemon not in cache
                if (this.cache[result.name] === undefined) {
                    promises.push(axios.get(result.url))
                } else {
                    this.advList.push(this.cache[result.name])
                }
            })
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
        },

        async getPokemon(name: string) {
            if (this.cache[name] !== undefined) {
                this.pokemon = this.cache[name]
            } else {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/"+name)
                this.pokemon = response.data
                this.cache[name] = response.data
            }

            // Fetch move details for each move in the pokemonData.moves array
            let movePromises = this.pokemon.moves.map((moveData) => {
                // Fetch detailed move data
                return axios.get(moveData.move.url)
                    .then(moveResponse => {
                        const moveDetails = moveResponse?.data

                        // Extract relevant move details
                        return {
                            version_group_details: moveData.version_group_details,
                            move: moveData.move,
                            power: moveDetails.power || null,
                            accuracy: moveDetails.accuracy || null,
                            pp: moveDetails.pp,
                            type: moveDetails.type || null,
                            damage_class: moveDetails.damage_class.name,
                            flavor_text: moveDetails.flavor_text_entries,
                            effect_entries: moveDetails.effect_entries,
                        }
                    })
            })

            // Wait for all move details to be fetched and processed
            const detailedMoves = await Promise.all(movePromises)

            // Add detailed moves to pokemonData object
            this.pokemon.moves = detailedMoves;
        }
    }
})

type SearchState = {
    basicList: Array<PokemonListResource>,
    advList: Array<PokemonResource>,
    cache: {
        [key: string]: PokemonResource
    },
    pokemon: PokemonResource
}

export type PokemonListResource = {
    name: string,
    url: string
}

export type PokemonResource = {
    name: string
    url: string
    height: number
    weight: number
    base_experience: number
    types: Array<{
        slot: number
        type: {
            name: string
            url: string
        }
    }>
    held_items: Array<{
        item: {
            name: string
            url: string
        }
        version_details: Array<{
            rarity: number
            version: {
                name: string
                url: string
            }
        }>
        location_area_encounters: string
    }>
    abilities: Array<{
        ability: {
            name: string
            url: string
        }
        is_hidden: boolean
        slot: number
    }>
    moves: Array<{
        move: {
            name: string
            url: string
        }
        version_group_details: Array<{
            level_learned_at: number
            version_group: {
                name: string
                url: string
            }
            move_learn_method: {
                name: string
                url: string
            }
        }>
    }>
    species: {
        name: string
        url: string
    }
    forms: Array<{
        name: string
        url: string
    }>
    sprites: {
        front_default: string
        back_default: string
        front_shiny: string
        back_shiny: string
        other: {
            [key: string]: {
                front_default: string
                back_default: string
                front_shiny: string
                back_shiny: string
            }
        }
    }
    stats: Array<{
        base_stat: number
        effort: number
        stat: {
            name: string
            url: string
        }
    }>
}

