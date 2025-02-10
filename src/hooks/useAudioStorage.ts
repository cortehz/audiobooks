import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlaybackState {
  position: number;
  trackIndex: number;
  lastPlayedAt: string;
}

export interface SavedBook {
  id: string;
  title: string;
  coverart_thumbnail: string;
  playbackState?: PlaybackState;
}

export function useAudioStorage() {
  const SAVED_BOOKS_KEY = '@saved_books';
  const PLAYBACK_STATE_KEY = '@playback_state';

  const saveBook = async (book: SavedBook) => {
    try {
      const savedBooks = await getSavedBooks();
      const updatedBooks = [...savedBooks];

      const existingIndex = updatedBooks.findIndex((b) => b.id === book.id);
      if (existingIndex !== -1) {
        updatedBooks[existingIndex] = book;
      } else {
        updatedBooks.push(book);
      }

      await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const getSavedBooks = async (): Promise<SavedBook[]> => {
    try {
      const books = await AsyncStorage.getItem(SAVED_BOOKS_KEY);

      console.log({ books }, 'books played');
      return books ? JSON.parse(books) : [];
    } catch (error) {
      console.error('Error getting saved books:', error);
      return [];
    }
  };

  const removeBook = async (bookId: string) => {
    try {
      const savedBooks = await getSavedBooks();
      const updatedBooks = savedBooks.filter((book) => book.id !== bookId);
      await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const savePlaybackState = async (bookId: string, state: PlaybackState) => {
    console.log(state, 'statesavewed');
    try {
      const key = `${PLAYBACK_STATE_KEY}_${bookId}`;
      await AsyncStorage.setItem(key, JSON.stringify(state));

      // Also update the book in saved books
      const savedBooks = await getSavedBooks();
      const bookIndex = savedBooks.findIndex((book) => book.id === bookId);
      if (bookIndex !== -1) {
        savedBooks[bookIndex].playbackState = state;
        await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(savedBooks));
      }
    } catch (error) {
      console.error('Error saving playback state:', error);
    }
  };

  const getPlaybackState = async (
    bookId: string
  ): Promise<PlaybackState | null> => {
    try {
      const key = `${PLAYBACK_STATE_KEY}_${bookId}`;
      const state = await AsyncStorage.getItem(key);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Error getting playback state:', error);
      return null;
    }
  };

  return {
    saveBook,
    getSavedBooks,
    removeBook,
    savePlaybackState,
    getPlaybackState,
  };
}
