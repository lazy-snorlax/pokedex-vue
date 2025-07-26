import axios from "axios";
import { defineStore } from "pinia";
import pLimit from "p-limit";
import { 
    saveToDb, 
    getPokemonFromDb, 
    getMoveFromDb,
    getAbilityFromDb, 
} from '../idb.ts';

const limit = pLimit(10)

export const useSearchStore = defineStore('search', {
    state: (): SearchState => ({
        searchTerm: '',
        pokeList: [],
        filteredList: [],
        promises: [],

        advList: [],
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
        async searchPokemon(partial: string) {
            // console.log(">>>> Searching: ", partial)
            if (partial.length >= 3) {
                this.filteredList = this.pokeList.filter((pokemon) => {
                    return pokemon.name.includes(partial.toLowerCase())
                })
            }
        },

        async getAllPokemon() {
            await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=10500")
            .then(response => {
                this.pokeList = response.data.results
            })
        },
        
        async getPokeData(filtered: Array<PokemonListResource>) {
            console.log(">>>> Fetching PokeData: ", filtered)
            this.advList = []; // Reset advList to blank
            let promises = []; // Init empty promise array
            
            for (const result of filtered) {
                const pokemon = await getPokemonFromDb(result.name)
                if (pokemon == null) {
                    // Fetch and cache
                    promises.push(
                        axios.get(result.url).then(async (resp) => {
                            await saveToDb('pokemon', resp.data.name, resp.data)
                            return resp.data
                        })
                    )
                } else {
                    this.advList.push(pokemon)
                }
            }
            
            const fetchedPokemon = await Promise.all(promises)
            this.advList.push(...fetchedPokemon)
        },

        async getPokemon(name: string) {
            let pokemon = await getPokemonFromDb(name);
            if (pokemon) {
                this.pokemon = pokemon
            } else {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/"+name)
                this.pokemon = response.data
                saveToDb('pokemon', name, response.data)
            }

            const abilityPromises = this.pokemon.abilities.map((ability: any) => limit(async () => {
                const abilityName = ability.ability.name
                let abilityDetails = await getAbilityFromDb(abilityName);
                if (!abilityDetails) {
                    const abilityResponse = await axios.get(ability.ability.url)
                    abilityDetails = abilityResponse?.data
                    await saveToDb('abilities', abilityName, abilityDetails)
                }
                return {
                    ability: {
                        name: abilityDetails.name,
                        flavor_text: abilityDetails.flavor_text_entries,
                    },
                    is_hidden: ability.is_hidden
                }
            }))
            const detailedAbilites = await Promise.all(abilityPromises)
            this.pokemon.abilities = detailedAbilites
            
            // Fetch move details for each move in the pokemonData.moves array
            const movePromises = this.pokemon.moves.map((moveData) => limit(async () => {
                const moveName = moveData.move.name;
                
                // Check if move details are already in the IndexedDB cache
                let moveDetails = await getMoveFromDb(moveName);
                if (!moveDetails) {
                    // Fetch from API if not in cache
                    const moveResponse = await axios.get(moveData.move.url);
                    moveDetails = moveResponse?.data;

                    // Store in cache
                    await saveToDb('moves', moveName, moveDetails)
                }

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
            }))

            // Wait for all move details to be fetched and processed
            const detailedMoves = await Promise.all(movePromises)

            // Add detailed moves to pokemonData object
            this.pokemon.moves = detailedMoves;
        }
    }
})

type SearchState = {
    searchTerm: string,
    pokeList: Array<PokemonListResource>,
    filteredList: Array<PokemonListResource>,

    advList: Array<PokemonResource>,
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

