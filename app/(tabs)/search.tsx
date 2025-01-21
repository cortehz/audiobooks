import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Audio } from 'expo-av';
import { BookCard } from '@components/common/book-card';
import { useGetInfiniteBooks } from '@hooks/useGetBooks';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react-native';
import { Audiobook } from '../../src/lib/api';

// Types remain the same as previous version
interface PlayerScreenProps {
  userId: string;
  supabaseUrl: string;
  supabaseKey: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  currentSection: number;
}

const Page: React.FC<PlayerScreenProps> = ({
  userId,
  supabaseUrl,
  supabaseKey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null);
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    position: 0,
    duration: 0,
    currentSection: 0,
  });
  const [sound, setSound] = useState<any>(null);

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        return;
      }
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  const {
    data: books,
    isPending,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteBooks({
    query: debouncedSearchQuery,
    enabled: !!debouncedSearchQuery,
  });

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='p-4 border-b border-gray-200 bg-white'>
        <View className='flex-row items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full'>
          {/* <Search size={20} color="#6B7280" /> */}
          <TextInput
            className='flex-1 text-base text-gray-900'
            placeholder='Search audiobooks...'
            placeholderTextColor='#9CA3AF'
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
          />
        </View>
      </View>

      {isPending ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#6366F1' />
        </View>
      ) : books && books.pages.length > 0 ? (
        <FlatList
          data={books ? books.pages.flat(1) : []}
          renderItem={({ item }) => (
            <View
              className=' mb-4'
              //   onPress={() => loadAudio(item)}
            >
              <BookCard book={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              // onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-gray-500'>No results found</Text>
        </View>
      )}

      {selectedBook && (
        <View className='border-t border-gray-200 bg-white p-4'>
          <View className='mb-3'>
            <Text
              className='text-base font-semibold text-gray-900'
              numberOfLines={1}
            >
              {selectedBook.title}
            </Text>
            <Text className='text-sm text-gray-600'>
              Section {playerState.currentSection + 1} of{' '}
              {selectedBook.num_sections}
            </Text>
          </View>

          <View className='flex-row justify-around items-center'>
            <TouchableOpacity
              className='p-2'
              //   onPress={() => skipSection('prev')}
              disabled={playerState.currentSection === 0}
            >
              <SkipBack
                size={24}
                color={playerState.currentSection === 0 ? '#D1D5DB' : '#111827'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className='p-4 bg-indigo-600 rounded-full'
              //   onPress={togglePlayPause}
            >
              {playerState.isPlaying ? (
                <Pause size={24} color='#FFFFFF' />
              ) : (
                <Play size={24} color='#FFFFFF' />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className='p-2'
              //   onPress={() => skipSection('next')}
              disabled={
                playerState.currentSection ===
                Number(selectedBook.num_sections) - 1
              }
            >
              <SkipForward
                size={24}
                color={
                  playerState.currentSection ===
                  Number(selectedBook.num_sections) - 1
                    ? '#D1D5DB'
                    : '#111827'
                }
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View className='mt-3 h-1 bg-gray-200 rounded-full'>
            <View
              className='h-full bg-indigo-600 rounded-full'
              style={{
                width: `${
                  (playerState.position / playerState.duration) * 100
                }%`,
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Page;
