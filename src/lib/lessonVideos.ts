import { supabase } from './supabase';

export const LESSON_VIDEO_BUCKET = 'ndm-lesson-videos';
export const MAX_VIDEO_BYTES = 45 * 1024 * 1024;

export function isStoredLessonVideo(url?: string): boolean {
  return !!url && /^storage:ndm-lesson-videos\/[a-zA-Z0-9/_-]+\.mp4$/.test(url);
}
export function storedVideoPath(url: string): string | null {
  return isStoredLessonVideo(url) ? url.slice('storage:ndm-lesson-videos/'.length) : null;
}
export async function uploadLessonVideo(file: File): Promise<string> {
  if (!supabase) throw new Error('Configure o Supabase antes de enviar vídeos.');
  if (file.type !== 'video/mp4' || !file.name.toLowerCase().endsWith('.mp4')) throw new Error('Escolha um arquivo MP4.');
  if (!file.size || file.size > MAX_VIDEO_BYTES) throw new Error('O vídeo deve ter até 45 MB nesta fase de testes.');
  const { data: session } = await supabase.auth.getUser();
  if (!session.user) throw new Error('Faça login como administrador.');
  const path = session.user.id + '/' + crypto.randomUUID() + '.mp4';
  const { error } = await supabase.storage.from(LESSON_VIDEO_BUCKET).upload(path, file, { contentType: 'video/mp4', upsert: false });
  if (error) throw new Error(error.message);
  return 'storage:' + LESSON_VIDEO_BUCKET + '/' + path;
}
export async function getLessonVideoUrl(value: string): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const path = storedVideoPath(value);
  if (!path) throw new Error('Vídeo armazenado inválido.');
  const { data, error } = await supabase.storage.from(LESSON_VIDEO_BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) throw new Error('Sem permissão para assistir a este vídeo.');
  return data.signedUrl;
}
