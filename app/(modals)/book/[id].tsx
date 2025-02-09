import AudioPlayer from '@components/common/audio-player';
import { useGetBook } from '@hooks/useGetBooks';
import { Link, router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  CloudDownload,
  Headset,
  Heart,
  ListPlus,
} from 'lucide-react-native';
import { useState } from 'react';

import { Text } from '@components/common/typography';
import { Image, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const stripHtmlTags = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams();
  const isPresented = router.canGoBack();

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

  const { data: book } = useGetBook({ id: id as string });

  console.log(book);

  return (
    <Animated.View entering={FadeIn} className='flex-1 bg-[#FEEFD7]'>
      {/* Dismiss modal when pressing outside */}
      <Link href={'/'} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View entering={SlideInDown} className=''>
        <View className='border-b border-gray-800 py-4'>
          <SafeAreaView />
          <GoBack />

          {book ? (
            <>
              <Image
                source={{ uri: book.coverart_jpg }}
                className='m-auto h-40 w-40 my-2'
              />
              <Text variant='heading' className='text-center'>
                {book.title}
              </Text>
              {book.authors.map((author) => (
                <Text
                  variant='body'
                  className='text-gray-500 text-center mb-8'
                  key={author.last_name}
                >
                  {author.first_name} {author.last_name}
                </Text>
              ))}
            </>
          ) : (
            <View className='flex-1 justify-center items-center h-64'>
              <Text variant='body'>Book not found</Text>
            </View>
          )}
        </View>
        <View className='items-center px-6 gap-4'>
          <Pressable className='flex-row gap-4 justify-center h-16 -mt-8 bg-[#ea580c] w-full p-4 m-auto border'>
            <Text variant='heading' className='text-center'>
              Start Listening
            </Text>

            <Headset color='black' />
          </Pressable>
          <View className='flex-row gap-2 items-center border border-gray-800 m-auto'>
            <Pressable className='flex-1 gap-2 items-center p-4 border-r border-gray-800'>
              <CloudDownload color='black' />
              <Text variant='body'>Download</Text>
            </Pressable>
            <Pressable className='flex-1 gap-2 items-center p-4 border-r border-gray-800'>
              <Bookmark color='black' />
              <Text variant='body'>Save</Text>
            </Pressable>
            <Pressable className='flex-1 gap-2 items-center p-4'>
              <ListPlus color='black' />
              <Text variant='body'>Save</Text>
            </Pressable>
          </View>
          <View className='w-full gap-2'>
            {[
              { label: 'Total time', value: book?.totaltime },
              { label: 'Total chapters', value: book?.num_sections },
              { label: 'Language', value: book?.language },
              { label: 'Copyright', value: book?.copyright_year },
            ].map((item) => (
              <View className='flex-row' key={item.label}>
                <Text variant='label' className='w-32'>
                  {item.label}
                </Text>
                <Text variant='body'>{item.value}</Text>
              </View>
            ))}
          </View>
          <View className='border-t border-gray-800 pt-4'>
            <Text variant='body' className='leading-6'>
              {stripHtmlTags(book?.description || '')}
            </Text>
          </View>
        </View>

        {book && (
          <View className='mt-8'>
            <AudioPlayer audiobook={book} />
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}
