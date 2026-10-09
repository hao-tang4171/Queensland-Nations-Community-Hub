
import {
    fetchNarratives,
    renderNarratives,
    renderLoading,
    renderEmpty,
    renderError
} from "../modules/narratives.js";


const NARRATIVES_URL = "data/narratives.json";

async function initNarratives() {
    const container = document.getElementById("narrative-grid");
    if (!container) return;

    // 1) loading 
    renderLoading(container);

    try {
        const narratives = await fetchNarratives(NARRATIVES_URL);

        if (narratives.length === 0) {
            // 2) empty 
            renderEmpty(container);
        } else {
            // 3) success 
            renderNarratives(container, narratives);
        }
    } catch (error) {
        // 4) error 
        renderError(container, error.message);
    }
}

initNarratives();