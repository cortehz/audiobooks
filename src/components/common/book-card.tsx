import { useRouter } from 'expo-router';
import { Ellipsis, Loader2 } from 'lucide-react-native';
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
      className='flex-row items-start gap-6'
    >
      <Image
        source={{ uri: book.coverart_thumbnail }}
        className='w-20 h-20 rounded-xl bg-slate-100'
        defaultSource={require('assets/adaptive-icon.png')}
      />
      <View>
        <Text className='text-xl font-medium'>{book.title}</Text>
        {book.authors.map((author, i) => {
          return (
            <Text className='text-gray-500' key={`${author.id}-${i}`}>
              {author.first_name.trimStart()} {author.last_name}
            </Text>
          );
        })}
      </View>
      <View className='ml-auto'>
        <Pressable>
          <Ellipsis color={'#94a3b8'} />
        </Pressable>

        <Loader2 color={'#2563eb'} />
      </View>
    </Pressable>
  );
}
