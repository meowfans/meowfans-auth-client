'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignupInput } from '@/lib/constants';
import { isValidEmail, isValidPassword } from '@/util/helpers';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Header } from './Header';

interface Props {
  handleSignup: (e: FormEvent<HTMLFormElement>, input: SignupInput) => unknown;
  loading: boolean;
}

const emptyInput: SignupInput = {
  email: '',
  fullName: '',
  password: ''
};

const SignupForm: React.FC<Props> = ({ handleSignup, loading }) => {
  const [input, setInput] = useState<SignupInput>(emptyInput);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('account');
  const [initialInput, setInitialInput] = useState<SignupInput>(emptyInput);

  const handleChangeInput = ({ key, value }: { key: keyof SignupInput; value: string }) => {
    setInitialInput((prev) => ({ ...prev, [key]: value }));
    setInput((prev) => ({ ...prev, [key]: value.trim() }));
  };

  useEffect(() => {
    setDisabled(!input.email || !input.password || !input.fullName || !isValidEmail(input.email) || !isValidPassword(input.password));
  }, [input.email, input.password, input.fullName]);

  return (
    <form className="p-6 md:p-8 flex flex-col" onSubmit={(e) => handleSignup(e, input)}>
      <div className="flex flex-col gap-6">
        <Header />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-1">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-fullname">Full name</Label>
              <Input
                id="tabs-demo-fullname"
                placeholder="Meow User"
                type="text"
                value={initialInput.fullName}
                onChange={(e) =>
                  handleChangeInput({
                    key: 'fullName',
                    value: e.target.value
                  })
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-email">Email</Label>
              <Input
                id="tabs-demo-email"
                placeholder="meow@gmail.com"
                type="email"
                value={initialInput.email}
                onChange={(e) =>
                  handleChangeInput({
                    key: 'email',
                    value: e.target.value
                  })
                }
              />
            </div>
            <Button type="button" className="w-full" onClick={() => setActiveTab('password')}>
              Next
            </Button>
          </TabsContent>

          <TabsContent value="password" className="space-y-1">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-password">Password</Label>
              <Input
                id="tabs-demo-password"
                type="password"
                required
                placeholder="password"
                autoComplete="password"
                value={initialInput.password}
                onChange={(e) =>
                  handleChangeInput({
                    key: 'password',
                    value: e.target.value
                  })
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={disabled}>
              {loading && <Loader2Icon className="animate-spin" />}
              Signup
            </Button>
          </TabsContent>
        </Tabs>

        {/* TODO: IMPLEMENT OAUTH LOGIN AFTER EMAIL CONFIGURATION */}
        {/* <OtherLogin /> */}

        <div className="text-center text-sm flex flex-col">
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
