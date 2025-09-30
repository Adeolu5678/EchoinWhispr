// Whispers types
export interface Whisper {
  id: string;
  content: string;
  authorId: string;
  recipientId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreateWhisperData {
  content: string;
  recipientId?: string;
}
