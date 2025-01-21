import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
// import { Audio } from 'expo-av';
import { BookCard } from '@components/common/book-card';
import { Link } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Audiobook } from '../../src/lib/api';

interface AudioPlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  currentSection: number;
}

const Page = () => {
  const fav: Audiobook[] = [];

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='p-4'>
        <Text className='text-xl font-bold'>My Favourites</Text>
        {fav.length > 0 ? (
          <FlatList
            data={fav}
            renderItem={({ item }) => <BookCard book={item} />}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-center text-gray-500'>No favourites yet</Text>
            <Link
              href='/search'
              asChild
              className='flex-row items-center gap-2'
            >
              <>
                <Text className='text-blue-600 font-semibold text-sm'>
                  Find books
                </Text>
                <Search size={20} color='#6B7280' />
              </>
            </Link>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Page;
