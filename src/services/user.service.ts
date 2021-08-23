import ky from 'ky';

import { UserDTO, UserInterface } from '@junoapp/common';
import { API_URL } from '../utils/constants';

export async function getAll(): Promise<UserInterface[]> {
  return ky.get(`${API_URL}/api/user`).json();
}

export async function getById(id: number): Promise<UserInterface> {
  return ky.get(`${API_URL}/api/user/${id}`).json();
}

export async function save(user: UserDTO): Promise<UserInterface> {
  return ky
    .post(`${API_URL}/api/user`, {
      json: user,
    })
    .json();
}

export async function remove(id: number): Promise<Response> {
  return ky.delete(`${API_URL}/api/user/${id}`);
}

export async function savePreferences(id: number, preferences: any): Promise<Response> {
  return ky.post(`${API_URL}/api/user/preferences/${id}`, {
    json: preferences,
  });
}
