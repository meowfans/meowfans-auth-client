import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginInput } from '@/lib/constants';
import { isValidEmail, isValidPassword } from '@/util/helpers';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Header } from './Header';

interface Props {
  handleLogin: (e: FormEvent<HTMLFormElement>, input: LoginInput) => unknown;
  loading: boolean;
}

const emptyInput = {
  email: '',
  password: ''
};

const LoginForm: React.FC<Props> = ({ handleLogin, loading }) => {
  const [input, setInput] = useState<LoginInput>(emptyInput);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialInput, setInitialInput] = useState<LoginInput>(emptyInput);

  const handleChangeInput = ({ key, value }: { key: keyof LoginInput; value: string }) => {
    setInitialInput((prev) => ({ ...prev, [key]: value }));
    setInput((prev) => ({ ...prev, [key]: value.trim() }));
  };

  useEffect(() => {
    setDisabled(
      !initialInput.email || !initialInput.password || !isValidEmail(initialInput.email) || !isValidPassword(initialInput.password)
    );
  }, [initialInput.email, initialInput.password]);

  return (
    <form className="p-6 md:p-8" onSubmit={(e) => handleLogin(e, input)}>
      <div className="flex flex-col gap-6">
        <Header />
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
            value={initialInput.email}
            onChange={(e) => handleChangeInput({ key: 'email', value: e.target.value })}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* TODO: IMPLEMENT FORGOT-PASSWORD AFTER EMAIL CONFIGURATION */}
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline hidden">
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="******"
            required
            autoComplete="password"
            value={initialInput.password}
            onChange={(e) => handleChangeInput({ key: 'password', value: e.target.value })}
          />
        </div>
        <Button disabled={disabled} type="submit" className="w-full">
          {loading && <Loader2Icon className="animate-spin" />}
          Login
        </Button>
        {/* TODO: IMPLEMENT OAUTH LOGIN AFTER EMAIL CONFIGURATION */}
        {/* <OtherLogin /> */}
        <div className="text-center text-sm flex flex-col">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};
export default LoginForm;
