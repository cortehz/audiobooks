import { allBooks } from 'app/(tabs)';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Headset, Heart } from 'lucide-react-native';
import { useState } from 'react';

import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams();
  const isPresented = router.canGoBack();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const book = allBooks?.find((book) => book.id === id);

  return (
    <Animated.View entering={FadeIn} className='flex-1'>
      {/* Dismiss modal when pressing outside */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View entering={SlideInDown}>
        <View className='bg-slate-200 rounded-b-[32px] py-4'>
          <SafeAreaView />
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

          <Image
            source={{ uri: book?.coverart_jpg }}
            className='w-3/5 m-auto h-64 rounded-lg basis-1/2 my-12'
          />

          <Text className='text-xl font-bold text-center mb-2'>
            {book?.title}
          </Text>
          {book?.authors.map((author) => (
            <Text
              className='text-sm text-gray-500 text-center mb-8'
              key={author.last_name}
            >
              {author.first_name} {author.last_name}
            </Text>
          ))}
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
