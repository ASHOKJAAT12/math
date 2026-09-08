const STORAGE_KEY = 'nma_calculation_history';
const VERSION = '1.0';

/**
 * Retrieves all saved calculations from local storage.
 * @returns {Array} Array of history objects
 */
export const getHistory = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Failed to parse history from localStorage', err);
        return [];
    }
};

/**
 * Retrieves a specific calculation by ID.
 * @param {string} id
 * @returns {object|null}
 */
export const getCalculationById = (id) => {
    const history = getHistory();
    return history.find(entry => entry.id === id) || null;
};

/**
 * Generates a unique ID
 */
const generateId = () => {
    return 'calc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Saves a numerical calculation to history.
 * @param {object} calculationData - The structured data to save
 * @returns {object} { success: boolean, id: string, message: string }
 */
export const saveCalculation = (calculationData) => {
    try {
        const history = getHistory();

        const newEntry = {
            ...calculationData,
            id: generateId(),
            timestamp: new Date().toISOString(),
            version: VERSION
        };

        history.push(newEntry);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return { success: true, id: newEntry.id, message: 'Calculation saved successfully.' };
    } catch (err) {
        console.error('Failed to save calculation to localStorage', err);
        return { success: false, id: null, message: 'The calculation could not be saved locally (Storage limit exceeded or unavailable).' };
    }
};

/**
 * Deletes a specific calculation.
 * @param {string} id 
 * @returns {boolean} True if successful
 */
export const deleteCalculation = (id) => {
    try {
        let history = getHistory();
        history = history.filter(entry => entry.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return { success: true, message: 'Calculation deleted.' };
    } catch (err) {
        console.error('Failed to delete calculation', err);
        return { success: false, message: 'Failed to delete the calculation.' };
    }
};

/**
 * Clears all calculation history.
 * @returns {boolean} True if successful
 */
export const clearHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return { success: true, message: 'History cleared.' };
    } catch (err) {
        console.error('Failed to clear history', err);
        return { success: false, message: 'Failed to clear history.' };
    }
};
