import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import {
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
} from 'lucide-react-native';
import * as rssParser from 'react-native-rss-parser';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
}

interface Audiobook {
  id: string;
  title: string;
  description: string;
  url_text_source: string;
  language: string;
  copyright_year: string;
  num_sections: string;
  url_rss: string;
  url_zip_file: string;
  url_project: string;
  url_librivox: string;
  url_other: string;
  totaltime: string;
  totaltimesecs: number;
  authors: Author[];
  coverart_jpg: string;
  coverart_pdf: string;
  coverart_thumbnail: string;
  narrator: string;
}

interface AudioPlayerProps {
  audiobook: Audiobook;
}

export default function AudioPlayer({ audiobook }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    fetchAudioUrls();
  }, []);

  useEffect(() => {
    if (audioUrls.length > 0) {
      loadAudio(audioUrls[currentTrackIndex]);
    }
  }, [audioUrls, currentTrackIndex]);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      console.log('Setting up playback status subscription');
      const subscription = sound.setOnPlaybackStatusUpdate(
        onPlaybackStatusUpdate
      );
      return () => {
        console.log('Cleaning up playback status subscription');
        sound.unloadAsync();
      };
    }
  }, [sound]);

  async function fetchAudioUrls() {
    try {
      console.log('Fetching RSS from:', audiobook.url_rss);
      const response = await fetch(audiobook.url_rss);
      const responseText = await response.text();
      console.log('RSS response:', responseText.substring(0, 200)); // Log first 200 chars
      const rss = await rssParser.parse(responseText);
      const urls = rss.items
        .map((item) => item.enclosures[0]?.url)
        .filter(Boolean);
      console.log('Parsed audio URLs:', urls);
      setAudioUrls(urls);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      setIsLoading(false);
    }
  }

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);

      console.log('Playback Status:', {
        position: status.positionMillis,
        duration: status.durationMillis,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
      });
    } else {
      if (status.error) {
        console.error('Playback error:', status.error);
      }
    }
  };

  async function loadAudio(audioUrl: string) {
    try {
      console.log('Loading audio from URL:', audioUrl);

      if (sound) {
        console.log('Unloading previous sound');
        await sound.unloadAsync();
      }

      console.log('Creating new sound object');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      console.log('Sound created successfully');
      setSound(newSound);

      const status = await newSound.getStatusAsync();
      console.log('Initial sound status:', status);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  }

  async function playPause() {
    if (sound) {
      try {
        if (isPlaying) {
          console.log('Pausing audio');
          await sound.pauseAsync();
        } else {
          console.log('Playing audio');
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error in playPause:', error);
      }
    } else {
      console.log('No sound loaded');
    }
  }

  async function rewind() {
    if (sound) {
      const newPosition = Math.max(0, position - 10000);
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  }

  async function fastForward() {
    if (sound) {
      const newPosition = Math.min(duration, position + 10000);
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  }

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-100 p-4'>
      <Text className='text-sm text-gray-600 text-center mb-4'>
        {audiobook.authors
          .map((author) => `${author.first_name} ${author.last_name}`)
          .join(', ')}
      </Text>
      <Text className='text-sm text-gray-600 text-center mb-4'>
        Track {currentTrackIndex + 1} of {audioUrls.length}
      </Text>

      {/* Controls */}
      <View className='flex-row justify-center items-center space-x-4 mb-12'>
        <TouchableOpacity onPress={rewind} className='p-2'>
          <RewindIcon size={24} color='#4B5563' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playPause}
          className='p-2 bg-blue-500 rounded-full'
        >
          {isBuffering ? (
            <ActivityIndicator size='small' color='#FFFFFF' />
          ) : isPlaying ? (
            <PauseIcon size={24} color='#FFFFFF' />
          ) : (
            <PlayIcon size={24} color='#FFFFFF' />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={fastForward} className='p-2'>
          <ForwardIcon size={24} color='#4B5563' />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className='mb-12'>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSliderValueChange}
          minimumTrackTintColor='#4B5563'
          maximumTrackTintColor='#D1D5DB'
          thumbTintColor='#3B82F6'
        />
        <View className='flex-row justify-between'>
          <Text className='text-xs text-gray-500'>{formatTime(position)}</Text>
          <Text className='text-xs text-gray-500'>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}
