import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import type { LoginProps } from './types';
import { Input } from '../Input';
import { Button } from '../Button';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function Login({
  email,
  password,
  onLogin,
  onSignUp,
}: LoginProps) {
  const [emailInput, setEmailInput] = useState(email);
  const [passwordInput, setPasswordInput] = useState(password);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const theme = useEzuiTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Input
        placeholder="Email"
        value={emailInput}
        onChangeText={setEmailInput}
      />
      <Input
        placeholder="Password"
        value={passwordInput}
        onChangeText={setPasswordInput}
        secureTextEntry={true}
        type="password"
      />
      {signingUp ? (
        <Input
          placeholder="Confirm Password"
          value={confirmPasswordInput}
          onChangeText={setConfirmPasswordInput}
          secureTextEntry={true}
          type="password"
        />
      ) : null}
      {!signingUp ? (
        <Button
          label="Login"
          onPress={() => onLogin(emailInput, passwordInput)}
        />
      ) : (
        <Button
          label="Sign Up"
          onPress={() =>
            onSignUp(emailInput, passwordInput, confirmPasswordInput)
          }
        />
      )}
      {!signingUp ? (
        <TouchableOpacity onPress={() => setSigningUp(true)}>
          <Text style={{ color: theme.colors.primary }}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setSigningUp(false)}>
          <Text style={{ color: theme.colors.primary }}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    borderRadius: 16,
    alignSelf: 'center',
    width: '100%',
    marginTop: '60%',
  },
});
