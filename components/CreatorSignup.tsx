'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorSignupInput } from '@/lib/constants';
import { isValidEmail, isValidPassword } from '@/util/helpers';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Header } from './Header';

interface Props {
  handleCreatorSignUp: (e: FormEvent<HTMLFormElement>, input: CreatorSignupInput) => unknown;
  loading: boolean;
}

const emptyInput: CreatorSignupInput = {
  email: '',
  fullName: '',
  password: '',
  username: ''
};

const CreatorSignup: React.FC<Props> = ({ handleCreatorSignUp, loading }) => {
  const [input, setInput] = useState<CreatorSignupInput>(emptyInput);
  const [activeTab, setActiveTab] = useState<string>('account');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [initialInput, setInitialInput] = useState<CreatorSignupInput>(emptyInput);

  const handleChangeInput = ({ key, value }: { key: keyof CreatorSignupInput; value: string }) => {
    setInitialInput((prev) => ({ ...prev, [key]: value }));
    setInput((prev) => ({ ...prev, [key]: value.trim() }));
  };

  useEffect(() => {
    setIsDisabled(
      !input.email ||
        !input.fullName ||
        !input.password ||
        !input.username ||
        !isValidEmail(input.email) ||
        !isValidPassword(input.password)
    );
  }, [input.email, input.fullName, input.password, input.username]);

  return (
    <form className="p-6 md:p-8 flex flex-col" onSubmit={(e) => handleCreatorSignUp(e, input)}>
      <div className="flex flex-col gap-6">
        <Header />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-1">
            <div className="grid gap-3">
              <Label htmlFor="creator-fullname">Full name</Label>
              <Input
                id="creator-fullname"
                placeholder="Meow User"
                type="text"
                value={initialInput.fullName}
                onChange={(e) => handleChangeInput({ key: 'fullName', value: e.target.value })}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="creator-email">Email</Label>
              <Input
                id="creator-email"
                placeholder="meow@fans.com"
                type="email"
                required
                autoComplete="email"
                value={initialInput.email}
                onChange={(e) => handleChangeInput({ key: 'email', value: e.target.value })}
              />
            </div>
            <Button type="button" className="w-full mt-7" onClick={() => setActiveTab('password')}>
              Next
            </Button>
          </TabsContent>

          <TabsContent value="password" className="space-y-1">
            <div className="grid gap-3">
              <Label htmlFor="creator-username">Username</Label>
              <Input
                id="creator-username"
                type="text"
                placeholder="@meowfan"
                autoComplete="username"
                value={initialInput.username}
                required
                onChange={(e) => handleChangeInput({ key: 'username', value: e.target.value })}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="creator-password">Password</Label>
              <Input
                id="creator-password"
                type="password"
                autoComplete="password"
                value={initialInput.password}
                onChange={(e) => handleChangeInput({ key: 'password', value: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full z-50" disabled={isDisabled}>
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

export default CreatorSignup;
