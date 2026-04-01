import { View, Text } from 'react-native';
import { Button } from '../Button';
import type { QuizCardProps } from './types';

export default function QuizCard({
  questions: _questions,
  answers: _answers,
  currentQuestion: _currentQuestion,
  onPress,
}: QuizCardProps) {
  return (
    <View>
      <Text>Quiz Card</Text>
      <Button label="Start Quiz" onPress={() => onPress?.()} />
    </View>
  );
}
