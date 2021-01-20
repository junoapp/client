export type UploadInfoField = {
  id: number;
  originalName?: string;
  name: string;
  index: number;
  role?: 'measure' | 'dimension';
  removed: boolean;
};
