import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useAudioStorage } from '../../hooks/useAudioStorage';

export default function Library() {
  const { getSavedBooks } = useAudioStorage();

  const { data: lastListened } = useQuery({
    queryKey: ['lastListened'],
    queryFn: () => getSavedBooks(),
  });

  return (
    <View className='flex-1 bg-white'>
      <FlatList
        data={lastListened}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/book/${item.id}`)}
            className='flex-row p-4 border-b border-gray-200'
          >
            <Image
              source={{ uri: item.coverart_thumbnail }}
              className='w-16 h-16 rounded'
            />
            <View className='ml-4 flex-1'>
              <Text className='font-bold'>{item.title}</Text>
              {item.playbackState && (
                <Text className='text-gray-600'>
                  Last played:{' '}
                  {new Date(
                    item.playbackState.lastPlayedAt
                  ).toLocaleDateString()}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
