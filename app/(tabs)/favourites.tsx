import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
// import { Audio } from 'expo-av';
import { BookCard } from '@components/common/book-card';
import { Link } from 'expo-router';
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
    <SafeAreaView className='bg-white flex-1'>
      <View className='p-4 flex-1'>
        <Text className='text-xl font-bold'>My Favourites</Text>
        {fav.length > 0 ? (
          <FlatList
            data={fav}
            renderItem={({ item }) => <BookCard book={item} />}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-center text-gray-500 text-4xl my-2'>
              No favourites yet
            </Text>
            <Link href='/allbooks/all' asChild>
              <Text className='text-blue-600 font-semibold text-2xl'>
                Find books
              </Text>
            </Link>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Page;
