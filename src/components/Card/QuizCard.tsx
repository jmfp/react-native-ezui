import { View, Text } from 'react-native';
import { Button } from '../Button';
import type { QuizCardProps } from './types';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function QuizCard({
  questions,
  answers,
  currentQuestion,
  onPress,
}: QuizCardProps) {
  const theme = useEzuiTheme();
  return (
    <View>
      <Text>Quiz Card</Text>
      <Button onPress={() => {}}>Start Quiz</Button>
    </View>
  );
}
