import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import type { LoginProps } from './types';
import { Input } from '../Input';
import { Button } from '../Button';
import { useEzuiTheme } from '../../theme/ThemeContext';
import springHabtHeader from '../../../../../../assets/images/SpringHabtHeader.png';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailErrorMessage(value: string): string {
  const t = value.trim();
  if (!t) return 'Email is required';
  if (!EMAIL_PATTERN.test(t)) return 'Enter a valid email address';
  return '';
}

function passwordErrorMessage(value: string, signup: boolean): string {
  if (!value) return 'Password is required';
  if (signup && value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return '';
}

function confirmPasswordErrorMessage(
  password: string,
  confirm: string
): string {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}

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
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const theme = useEzuiTheme();

  function goToSignUp() {
    setSigningUp(true);
    setEmailErr('');
    setPasswordErr('');
    setConfirmErr('');
  }

  function goToLogin() {
    setSigningUp(false);
    setEmailErr('');
    setPasswordErr('');
    setConfirmErr('');
    setConfirmPasswordInput('');
  }

  function submitLogin() {
    const e = emailErrorMessage(emailInput);
    const p = passwordErrorMessage(passwordInput, false);
    setEmailErr(e);
    setPasswordErr(p);
    setConfirmErr('');
    if (e || p) return;
    onLogin(emailInput.trim(), passwordInput);
  }

  function submitSignUp() {
    const e = emailErrorMessage(emailInput);
    const p = passwordErrorMessage(passwordInput, true);
    const c = confirmPasswordErrorMessage(passwordInput, confirmPasswordInput);
    setEmailErr(e);
    setPasswordErr(p);
    setConfirmErr(c);
    if (e || p || c) return;
    onSignUp(emailInput.trim(), passwordInput, confirmPasswordInput);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Image
        source={springHabtHeader as ImageSource}
        style={styles.logo}
        contentFit="contain"
      />
      <Input
        placeholder="Email"
        value={emailInput}
        onChangeText={(t) => {
          setEmailInput(t);
          setEmailErr('');
        }}
        type="email"
        autoCapitalize="none"
        autoCorrect={false}
        error={emailErr || undefined}
        style={{ backgroundColor: theme.colors.background }}
      />
      <Input
        placeholder="Password"
        value={passwordInput}
        onChangeText={(t) => {
          setPasswordInput(t);
          setPasswordErr('');
        }}
        secureTextEntry={true}
        type="password"
        textContentType={signingUp ? 'newPassword' : 'password'}
        error={passwordErr || undefined}
        style={{ backgroundColor: theme.colors.background }}
      />
      {signingUp ? (
        <Input
          placeholder="Confirm Password"
          value={confirmPasswordInput}
          onChangeText={(t) => {
            setConfirmPasswordInput(t);
            setConfirmErr('');
          }}
          secureTextEntry={true}
          type="password"
          textContentType="newPassword"
          error={confirmErr || undefined}
          style={{ backgroundColor: theme.colors.background }}
        />
      ) : null}
      {!signingUp ? (
        <Button label="Login" onPress={submitLogin} />
      ) : (
        <Button label="Sign Up" onPress={submitSignUp} />
      )}
      {!signingUp ? (
        <TouchableOpacity onPress={goToSignUp}>
          <Text style={{ color: theme.colors.primary }}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={goToLogin}>
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
  },
  logo: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
