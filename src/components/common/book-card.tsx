import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { Audiobook } from 'src/lib/api';
type BookCardProps = {
  book: Audiobook;
};
export function BookCard(props: BookCardProps) {
  const { book } = props;
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push(`/book/${book.id}`);
      }}
      className='items-start gap-2'
    >
      <View className='border border-gray-800'>
        <Image
          source={{ uri: book.coverart_thumbnail }}
          className='w-32 h-40 bg-slate-100 m-[2px]'
          defaultSource={require('assets/adaptive-icon.png')}
        />
      </View>
      <View>
        <Text className='text-sm font-medium w-32 text-wrap'>{book.title}</Text>
        {book.authors.map((author, i) => {
          return (
            <Text className='text-gray-500 text-xs' key={`${author.id}-${i}`}>
              {author.first_name.trimStart()} {author.last_name}
            </Text>
          );
        })}
      </View>
    </Pressable>
  );
}
