import { createPinia } from "pinia";
// import { http } from "../utils/http";

export const pinia = createPinia()

//  Set HTTP client as a custom property for all stores
// pinia.use(() => ({ http }))

// TODO: enable custom resorce plugins