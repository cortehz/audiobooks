import { BookCard } from '@components/common/book-card';
import { useGetInfiniteBooks } from '@hooks/useGetBooks';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Headset, Heart } from 'lucide-react-native';
import { useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function BooksScreen() {
  const { type } = useLocalSearchParams();
  const isPresented = router.canGoBack();

  const { isPending } = useGetInfiniteBooks({
    searchQuery: type === 'all' ? '' : (type as string),
    enabled: true,
  });

  function GoBack() {
    return (
      <View className='flex-row items-center justify-between px-6'>
        {isPresented && (
          <Pressable onPress={() => router.back()}>
            <ArrowLeft color='black' />
          </Pressable>
        )}
        <Pressable onPress={() => setIsBookmarked(!isBookmarked)}>
          <Heart
            fill={isBookmarked ? 'red' : 'none'}
            color={isBookmarked ? 'none' : '#6b7280'}
          />
        </Pressable>
      </View>
    );
  }

  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: books } = useGetInfiniteBooks({
    searchQuery: type === 'all' ? '' : (type as string),
    enabled: true,
  });

  console.log(books, 'book here');

  return (
    <Animated.View entering={FadeIn} className='flex-1'>
      {/* Dismiss modal when pressing outside */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View entering={SlideInDown} className=''>
        <View className='bg-slate-200 rounded-b-[32px] py-4'>
          <SafeAreaView />
          <GoBack />

          {isPending ? (
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='large' color='#6366F1' />
            </View>
          ) : books && books.pages.length > 0 ? (
            <>
              <FlatList
                data={books ? books.pages.flat(1) : []}
                renderItem={({ item }) => (
                  <View className=' mb-4'>
                    <BookCard book={item} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={false} />}
                contentContainerStyle={{ padding: 16 }}
              />
            </>
          ) : (
            <View className='flex-1 justify-center items-center h-64'>
              <Text>Book not found</Text>
            </View>
          )}
        </View>

        <Pressable className='flex-row gap-4 justify-center h-16 -mt-8 bg-blue-500 rounded-[16px] p-4 w-3/4 m-auto'>
          <Text className='text-center text-white text-lg font-bold '>
            Start Listening
          </Text>

          <Headset color='white' />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
