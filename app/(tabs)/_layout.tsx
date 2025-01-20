import { Tabs } from 'expo-router';
import { Bookmark, LibraryBig, Search, UserRound } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72,
          borderWidth: 0,
          borderRadius: 16,
          margin: 16,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          marginBottom: 28,
          paddingTop: 16,
          maxWidth: 420,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <LibraryBig color={color} />,
        }}
      />

      <Tabs.Screen
        name='bookmarks'
        options={{
          tabBarIcon: ({ color }) => <Bookmark color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({ color }) => <Search color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color }) => <UserRound color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
