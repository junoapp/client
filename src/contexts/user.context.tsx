import { createContext, useState } from 'react';

export interface UserContextData {
  user: string;
  disability: string;
  signIn(user: string, disability: string): void;
  signOut(): void;
}

export const UserContext = createContext<UserContextData | undefined>(undefined);

export function UserProvider(props: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<string>(localStorage.getItem('user'));
  const [disability, setDisability] = useState<string>(localStorage.getItem('disability'));

  function signIn(user: string, disability: string) {
    localStorage.setItem('user', user);
    localStorage.setItem('disability', disability);

    setUser(user);
    setDisability(disability);
  }

  function signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('disability');
    setUser(undefined);
    setDisability(undefined);
  }

  return (
    <UserContext.Provider value={{ user, disability, signIn, signOut }}>
      {props.children}
    </UserContext.Provider>
  );
}
