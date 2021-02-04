import ky from 'ky';

import { UserDTO, UserInterface } from '@junoapp/common';

export async function getAll(): Promise<UserInterface[]> {
  return ky.get('http://localhost:3001/api/user').json();
}

export async function getById(id: number): Promise<UserInterface> {
  return ky.get(`http://localhost:3001/api/user/${id}`).json();
}

export async function save(user: UserDTO): Promise<UserInterface> {
  return ky
    .post('http://localhost:3001/api/user', {
      json: user,
    })
    .json();
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`http://localhost:3001/api/user/${id}`);
}

export async function savePreferences(id: number, preferences: any): Promise<Response> {
  return ky.post(`http://localhost:3001/api/user/preferences/${id}`, {
    json: preferences,
  });
}
