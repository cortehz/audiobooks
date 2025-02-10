import { useQuery } from '@tanstack/react-query';
import * as rssParser from 'react-native-rss-parser';

export function useAudioRSS(url: string) {
  return useQuery({
    queryKey: ['audioRSS', url],
    queryFn: async () => {
      console.log('Fetching RSS from:', url);
      const response = await fetch(url);
      const responseText = await response.text();
      console.log('RSS response:', responseText.substring(0, 200));
      const rss = await rssParser.parse(responseText);
      const urls = rss.items
        .map((item) => item.enclosures[0]?.url)
        .filter(Boolean);
      console.log('Parsed audio URLs:', urls);
      return urls;
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
