export type LoginProps = {
  email: string;
  password: string;
  onLogin: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, confirmPassword: string) => void;
};
