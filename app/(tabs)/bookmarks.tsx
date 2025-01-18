import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Audio } from 'expo-av';
import { debounce } from 'lodash';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react-native';
import { Audiobook, AudiobookService } from '../../src/lib/api';

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
  // State declarations remain the same
  const [books, setBooks] = useState<Audiobook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null);
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    position: 0,
    duration: 0,
    currentSection: 0,
  });
  const [sound, setSound] = useState<any>(null);

  // Service initialization and handlers remain the same
  const audiobookService = new AudiobookService();

  // Previous handler implementations remain the same
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        // loadFeaturedBooks();
        return;
      }
      setLoading(true);
      try {
        const results = await audiobookService.searchBooks(query);
        setBooks(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  console.log(books, 'books');

  // Previous methods remain the same
  // loadFeaturedBooks, onRefresh, loadAudio, etc.

  const renderBookItem = ({ item }: { item: Audiobook }) => (
    <TouchableOpacity
      className='flex-row p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-100'
      //   onPress={() => loadAudio(item)}
    >
      <Image
        source={{ uri: item.coverart_thumbnail }}
        className='w-24 h-36 rounded'
        // defaultSource={require('./assets/default-cover.png')}
      />
      <View className='flex-1 ml-4 justify-between'>
        <View>
          <Text className='text-lg font-bold text-gray-900' numberOfLines={2}>
            {item.title}
          </Text>
          {item.authors && item.authors.length > 0 ? (
            item.authors.map((author) => (
              <Text className='text-base text-gray-700'>
                {author.first_name} {author.last_name}
              </Text>
            ))
          ) : (
            <Text className='text-base text-gray-700'>Unknown</Text>
          )}
          <Text className='text-sm text-gray-500'>
            Narrated by {item.narrator}
          </Text>
        </View>

        <View>
          <Text className='text-sm text-gray-600'>{item.totaltime}</Text>
          <Text className='text-sm text-gray-500'>
            {item.num_sections} sections • {item.language}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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

      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#6366F1' />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              // onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ padding: 16 }}
        />
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
