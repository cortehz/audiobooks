import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Types for LibriVox API responses
interface LibriVoxReader {
  reader_id: number;
  display_name: string;
  reader: string;
}

interface LibriVoxSection {
  id: number;
  section_number: number;
  title: string;
  playtime: string;
  url_librivox: string;
  mp3_64_url: string;
  reader: string;
}

interface LibriVoxBook {
  id: number;
  title: string;
  author: string;
  url_librivox: string;
  totaltime: string;
  totaltimesecs: number;
  description: string;
  genres: string[];
  language: string;
  readers: LibriVoxReader[];
  sections: LibriVoxSection[];
}

interface LibriVoxResponse {
  books: LibriVoxBook[];
}

// Types for our transformed data
interface AudioSection {
  id: number;
  title: string;
  duration: string;
  audioUrl: string | null;
  reader: string;
  sectionNumber: number;
}

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  dod: string;
}

export interface Audiobook {
  id: string;
  title: string;
  description: string;
  url_text_source: string;
  language: string;
  copyright_year: string;
  num_sections: string;
  url_rss: string;
  url_zip_file: string;
  url_project: string;
  url_librivox: string;
  url_other: string;
  totaltime: string;
  totaltimesecs: number;
  authors: Author[];
  coverart_jpg: string;
  coverart_pdf: string;
  coverart_thumbnail: string;
  narrator: string;
}

// Types for progress tracking
interface ReadingProgress {
  userId: string;
  bookId: number;
  currentSection: number;
  position: number;
  lastUpdated: string;
}

interface DownloadedSection {
  userId: string;
  bookId: number;
  sectionId: number;
  localPath: string;
  downloadedAt: string;
}

export class AudiobookService {
  private supabase: SupabaseClient;
  private readonly librivoxBaseUrl: string;
  private readonly internetArchiveUrl: string;

  constructor() {
    this.supabase = supabase;
    this.librivoxBaseUrl = 'https://librivox.org/api/feed/audiobooks/';
    this.internetArchiveUrl = 'https://archive.org/download';
  }

  async searchBooks(
    query: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<Audiobook[]> {
    try {
      const response = await fetch(
        `${this.librivoxBaseUrl}` +
          `title/^${encodeURIComponent(query)}` +
          `?offset=${offset}&coverart=1&limit=${limit}&format=json`
      );

      const data = (await response.json()) as LibriVoxResponse;
      return this.transformLibriVoxBooks(data.books || []);
    } catch (error) {
      console.error('Error searching LibriVox:', error);
      throw error;
    }
  }

  async getFeaturedBooks(limit: number = 20): Promise<Audiobook[]> {
    try {
      const response = await fetch(
        `${this.librivoxBaseUrl}?limit=${limit}&format=json`
      );

      const data = (await response.json()) as LibriVoxResponse;
      return this.transformLibriVoxBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching featured books:', error);
      throw error;
    }
  }

  private transformLibriVoxBooks(books: LibriVoxBook[]): Audiobook[] {
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author || 'Unknown Author',
      narrator: this.formatNarrators(book.readers),
      duration: this.formatDuration(book.totaltime),
      coverUrl: `https://www.archive.org/download/${book.url_librivox}/cover.jpg`,
      genres: book.genres || [],
      language: book.language,
      description: book.description || '',
      urlLibrivox: book.url_librivox,
      sections: this.formatSections(book.sections),
      totalTime: book.totaltime,
      totalTimeSeconds: book.totaltimesecs,
      rating: 0,
      isDownloaded: false,
      dateAdded: new Date().toISOString(),
    }));
  }

  private formatNarrators(readers?: LibriVoxReader[]): string {
    if (!readers?.length) return 'Various LibriVox Volunteers';
    return readers
      .map((reader) => reader.display_name || reader.reader)
      .join(', ');
  }

  private formatDuration(timeString?: string): string {
    if (!timeString) return 'Unknown';
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}h ${parts[1]}m`;
    }
    return timeString;
  }

  private formatSections(sections?: LibriVoxSection[]): AudioSection[] {
    if (!sections) return [];
    return sections.map((section) => ({
      id: section.id,
      title: section.title || `Section ${section.section_number}`,
      duration: section.playtime,
      audioUrl: this.getAudioUrl(section),
      reader: section.reader || 'Unknown Reader',
      sectionNumber: section.section_number,
    }));
  }

  private getAudioUrl(section: LibriVoxSection): string | null {
    if (!section.url_librivox || !section.mp3_64_url) return null;
    return `${this.internetArchiveUrl}/${section.url_librivox}/${section.mp3_64_url}`;
  }

  async saveToLibrary(userId: string, book: Audiobook): Promise<void> {
    try {
      const { error } = await this.supabase.from('user_library').insert([
        {
          user_id: userId,
          book_id: book.id,
          title: book.title,
          author: book.authors[0],
          narrator: book.narrator,
          cover_url: book.coverart_jpg,
          url_librivox: book.url_librivox,
          sections: [],
          total_time: book.totaltimesecs,
          progress: 0,
          current_section: 0,
          is_downloaded: false,
          date_added: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving to library:', error);
      throw error;
    }
  }

  async downloadSection(section: AudioSection): Promise<Blob> {
    if (!section.audioUrl) {
      throw new Error('No audio URL available for this section');
    }

    try {
      const response = await fetch(section.audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading section:', error);
      throw error;
    }
  }

  async updateProgress(progress: ReadingProgress): Promise<void> {
    try {
      const { error } = await this.supabase.from('reading_progress').upsert({
        user_id: progress.userId,
        book_id: progress.bookId,
        current_section: progress.currentSection,
        position: progress.position,
        last_updated: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async getProgress(
    userId: string,
    bookId: number
  ): Promise<ReadingProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as ReadingProgress | null;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  async markSectionDownloaded(
    userId: string,
    bookId: number,
    sectionId: number,
    localPath: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from('downloaded_sections').insert([
        {
          user_id: userId,
          book_id: bookId,
          section_id: sectionId,
          local_path: localPath,
          downloaded_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking section as downloaded:', error);
      throw error;
    }
  }

  async getDownloadedSections(
    userId: string,
    bookId: number
  ): Promise<DownloadedSection[]> {
    try {
      const { data, error } = await this.supabase
        .from('downloaded_sections')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (error) throw error;
      return data as DownloadedSection[];
    } catch (error) {
      console.error('Error fetching downloaded sections:', error);
      throw error;
    }
  }
}

export const audioBooksData: Audiobook = {
  id: '1594',
  title: 'Letters from Egypt',
  description:
    'As a girl, Lady Duff-Gordon was noted both for her beauty and intelligence. As an author, she is most famous for this collection of letters from Egypt. Lady Duff-Gordon had tuberculosis, and went to Egypt for her health. This collection of her personal letters to her mother and her husband. By all accounts everyone loved her, and the letters are very personal in style and content. The letters are as much an introduction to her person as a record of her life on the Upper Nile.',
  url_text_source: 'https://www.gutenberg.org/etext/17816',
  language: 'English',
  copyright_year: '1902',
  num_sections: '124',
  url_rss: 'https://librivox.org/rss/1594',
  url_zip_file:
    'https://www.archive.org/download/letters_egypt_sd_librivox/letters_egypt_sd_librivox_64kb_mp3.zip',
  url_project: '',
  url_librivox:
    'https://librivox.org/letters-from-egypt-by-lady-lucie-duff-gordon/',
  url_other: '',
  totaltime: '13:00:55',
  totaltimesecs: 46855,
  narrator: 'Samuel Omanchi',
  authors: [
    {
      id: '4574',
      first_name: ' Lucie',
      last_name: 'Duff-Gordon',
      dob: '1821',
      dod: '1869',
    },
  ],
  coverart_jpg:
    'https://www.archive.org/download/LibrivoxCdCoverArt4/Letters_from_Egypt_1003.jpg',
  coverart_pdf:
    'https://www.archive.org/download/LibrivoxCdCoverArt4/Letters_from_Egypt_1003.pdf',
  coverart_thumbnail:
    'https://www.archive.org/download/LibrivoxCdCoverArt4/Letters_from_Egypt_1003_thumb.jpg',
};
