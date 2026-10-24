import { auth, API_BASE_URL } from './firebase';

async function getAuthHeader(): Promise<Record<string, string>> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Tizimga kirilmagan.');
  const token = await currentUser.getIdToken(true); // true = tokenni majburan yangilash
  return { Authorization: `Bearer ${token}` };
}

export interface UploadResult {
  videoUrl: string;
  filename: string;
  size: number;
}

/**
 * Video faylni backend serverga yuklaydi. Faqat admin email bilan kirgan
 * foydalanuvchi uchun ishlaydi (server tomonda tekshiriladi).
 * onProgress 0-100 oralig'ida foiz qaytaradi.
 */
export function uploadVideo(file: File, onProgress?: (percent: number) => void): Promise<UploadResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = await getAuthHeader();
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/api/videos/upload`);
      xhr.setRequestHeader('Authorization', headers.Authorization);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error || 'Video yuklashda xatolik.'));
          } catch {
            reject(new Error('Video yuklashda xatolik.'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Serverga ulanib bo\'lmadi. Backend ishga tushganini tekshiring.'));
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}

/** Serverdagi videoni o'chiradi (faqat admin). */
export async function deleteVideoFile(filename: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/api/videos/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Videoni o\'chirishda xatolik.');
  }
}

/** videoUrl dan fayl nomini ajratib oladi (masalan .../stream/abc123.mp4 -> abc123.mp4) */
export function extractFilenameFromVideoUrl(videoUrl: string): string | null {
  const match = videoUrl.match(/\/stream\/([^/?#]+)/);
  return match ? match[1] : null;
}