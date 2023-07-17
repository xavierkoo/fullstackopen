import express from 'express';
import { parseBmiArguments, calculateBmi } from './bmiCalculator';
import { parseExerciseArguments, calculateExercises } from './exerciseCalculator';
const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/bmi', (req, res) => {
  const weight = req.query.weight;
  const height = req.query.height;

  if (!weight || !height) {
    res.status(400);
    res.send({ error: 'missing parameter height or weight' });
  } else {
    try {
      const { heightInCm, weightInKg } = parseBmiArguments(
        Number(height),
        Number(weight)
      );
      const bmi = calculateBmi(heightInCm, weightInKg);
      res.send({
        weight: weightInKg,
        height: heightInCm,
        bmi: bmi
      });
    } catch (e) {
      res.status(400);
      res.send({ error: e.message });
    }
  }
});

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;


  if ( !value1 || isNaN(Number(value1)) ) {
    return res.status(400).send({ error: '...'});
  }

  // more validations here...

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});