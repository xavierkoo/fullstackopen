interface ExerciseValues {
    target: number,
    dailyExerciseHours: Array<number>
}

export const parseExerciseArguments = (target: number, dailyExerciseHours: Array<number>): ExerciseValues => {
    if (!isNaN(target) && !dailyExerciseHours.some(hours => isNaN(hours))) {
        return {
            target,
            dailyExerciseHours
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

export const calculateExercises = (dailyExerciseHours: Array<number>, target: number): Result => {
    const periodLength = dailyExerciseHours.length;
    const trainingDays = dailyExerciseHours.filter(hours => hours > 0).length;
    const success = trainingDays >= target;
    const rating = success ? 3 : 1;
    const ratingDescription = success ? 'good job' : 'you can do better';
    const average = dailyExerciseHours.reduce((a, b) => a + b, 0) / periodLength;

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
}

try {
    const { target, dailyExerciseHours } = parseExerciseArguments(Number(process.argv[2]), process.argv.slice(3).map(hours => Number(hours)));
    console.log(calculateExercises(dailyExerciseHours, target));
} catch (e) {
    console.log('Error, something bad happened, message: ', e.message);
}
