import { Tabs } from 'expo-router';
import { Bookmark, LibraryBig, Search, UserRound } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#1f2937',

        tabBarStyle: {
          height: 96,
          borderTopWidth: 1,
          borderTopColor: '#1f2937',
          backgroundColor: '#FEEFD7',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          paddingTop: 8,
          paddingBottom: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <LibraryBig color={color} />,
        }}
      />

      <Tabs.Screen
        name='favourites'
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <Bookmark color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserRound color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
