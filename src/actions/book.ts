import { Audiobook, AudiobookService } from '../lib/api';

// Initialize the service
const audiobookService = new AudiobookService();

// Example usage with type safety
export async function searchAndSaveBook(query: string, userId: string) {
  try {
    const books = await audiobookService.searchBooks(query);
    if (books.length > 0) {
      await audiobookService.saveToLibrary(userId, books[0]);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Download and track a section
export async function downloadBookSection(
  userId: string,
  book: Audiobook,
  sectionIndex: number
) {
  const section = book.sections[sectionIndex];
  const blob = await audiobookService.downloadSection(section);

  // Save blob to local storage and get path
  const localPath = 'path/to/saved/file.mp3'; // Implementation depends on your storage solution

  await audiobookService.markSectionDownloaded(
    userId,
    book.id,
    section.id,
    localPath
  );
}
