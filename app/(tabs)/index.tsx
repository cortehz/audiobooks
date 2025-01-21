import { BookCard } from '@components/common/book-card';
import { useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetBooks } from 'src/hooks/useGetBooks';
import { Audiobook, audioBooksData } from 'src/lib/api';
const user = {
  firstname: 'Julia',
};

const lastListened = [] as Array<Audiobook>;
export const allBooks = Array.from({ length: 3 }).map(() => audioBooksData);

export default function HomeTab() {
  const router = useRouter();

  const { data: books } = useGetBooks({ query: '', limit: 3 });

  return (
    <View className='bg-white h-full'>
      <View className='m-6 gap-6'>
        <View>
          <SafeAreaView />
          <Text className='text-xl mt-4'>
            Hey, <Text className='font-bold'>{user.firstname}</Text>
          </Text>
          <Text className='text-xl'>What are you listening to today?</Text>
          <View className='bg-slate-100 p-6 rounded-2xl items-center my-6 py-10'>
            {lastListened[0]?.id ? (
              <BookCard book={lastListened[0]} />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  router.push('/search');
                }}
                className='border border-gray-500 w-28 px-2 py-2 rounded-lg'
              >
                <Text className='text-center'>Find book</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className='flex-row justify-between items-center'>
          <Text className='text-base font-medium'>
            {lastListened.length > 0 ? 'Last listened' : 'All books'}
          </Text>
          <Pressable
            onPress={() => {
              router.push('/books/all');
            }}
          >
            <Text className='text-blue-600  font-semibold text-sm'>
              View all
            </Text>
          </Pressable>
        </View>

        <ScrollView>
          <View className='gap-4'>
            {lastListened.length > 0
              ? lastListened.map((book, i) => {
                  return <BookCard book={book} key={i} />;
                })
              : books?.map((book, i) => {
                  return <BookCard book={book} key={`${i}-${book.id}`} />;
                })}
          </View>
        </ScrollView>

        <View className='flex-row justify-between items-center'>
          <Text className='text-base font-medium'>Favourites</Text>
          <Pressable
            onPress={() => {
              router.push('/favourites');
            }}
          >
            <Text className='text-blue-600 font-semibold text-sm'>
              View all
            </Text>
          </Pressable>
        </View>

        <ScrollView>
          <View className='gap-4'>
            {lastListened.length > 0
              ? lastListened.map((book, i) => {
                  return <BookCard book={book} key={i} />;
                })
              : allBooks.map((book, i) => {
                  return <BookCard book={book} key={`${i}-${book.id}`} />;
                })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
