import { BookCard } from '@components/common/book-card';
import { Link, useRouter } from 'expo-router';
import {
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
    <View className='bg-[#FEEFD7] h-full'>
      <View className='m-6 gap-6'>
        <View>
          <SafeAreaView />
          <Text className='text-xl mt-4'>
            Hey, <Text className='font-bold'>{user.firstname}</Text>
          </Text>
          <Text className='text-xl'>What are you listening to today?</Text>
          <View className=' border-gray-900 p-6 border items-center my-6 py-10'>
            {lastListened[0]?.id ? (
              <BookCard book={lastListened[0]} />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  router.push('/search');
                }}
                className='border border-gray-800 px-8 py-4 bg-orange-600'
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
          <Link href='/allbooks/all' asChild>
            <Text className='text-blue-600  font-semibold text-sm'>
              View all
            </Text>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-4'>
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
          <Link href='/favourites' asChild>
            <Text className='text-blue-600 font-semibold text-sm'>
              View all
            </Text>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-4'>
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
