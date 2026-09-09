// src/utils/learningProgress.js
const PROGRESS_KEY = 'nma_learning_progress';

export const getProgress = () => {
    try {
        const stored = localStorage.getItem(PROGRESS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.error("Local storage error reading progress", err);
    }

    // Default structure
    return {
        completedLessons: [],
        quizScores: []
    };
};

export const saveProgress = (progressData) => {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
        return true;
    } catch (err) {
        console.error("Local storage error saving progress", err);
        return false;
    }
};

export const markLessonComplete = (lessonId) => {
    const data = getProgress();
    if (!data.completedLessons.includes(lessonId)) {
        data.completedLessons.push(lessonId);
        saveProgress(data);
    }
};

export const saveQuizScore = (score, maxScore) => {
    const data = getProgress();
    data.quizScores.push({
        score,
        maxScore,
        date: new Date().toISOString()
    });
    saveProgress(data);
};

export const isLessonComplete = (lessonId) => {
    const data = getProgress();
    return data.completedLessons.includes(lessonId);
};

export const calculateCategoryProgress = (categoryIdsArray) => {
    const data = getProgress();
    let completedCount = 0;

    categoryIdsArray.forEach(id => {
        if (data.completedLessons.includes(id)) {
            completedCount++;
        }
    });

    if (categoryIdsArray.length === 0) return 0;
    return Math.round((completedCount / categoryIdsArray.length) * 100);
};
