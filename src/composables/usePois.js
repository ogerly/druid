import { ref } from 'vue';
import { pois as poiData } from '../data/pois';

export function usePois() {
  const pois = ref(poiData);

  // In a real application, this would fetch data from an API
  // For example:
  // async function fetchPois() {
  //   const response = await fetch('/api/pois');
  //   pois.value = await response.json();
  // }
  // onMounted(fetchPois);

  return { pois };
}
