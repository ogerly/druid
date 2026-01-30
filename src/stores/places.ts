
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Place {
  id: number
  coordinates: { lat: number; lng: number }
  description: string
}

export const usePlacesStore = defineStore('places', () => {
  const places = ref<Place[]>([])
  let nextId = 0

  function addPlace(placeData: Omit<Place, 'id'>) {
    places.value.push({
      id: nextId++,
      ...placeData,
    })
  }

  return { places, addPlace }
})
