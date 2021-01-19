import { createContext, useState } from 'react';

export interface UserContextData {
  user: string;
  signIn(user: string): void;
}

export const UserContext = createContext<UserContextData | undefined>(undefined);

export function UserProvider(props: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<string>(localStorage.getItem('user'));

  function signIn(user: string) {
    localStorage.setItem('user', user);
    setUser(user);
  }

  return <UserContext.Provider value={{ user, signIn }}>{props.children}</UserContext.Provider>;
}
