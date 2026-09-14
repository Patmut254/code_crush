import { Redirect } from 'expo-router';

export default function Index() {
  // _layout.tsx already redirects unonboarded players to /onboarding;
  // everyone else lands on the home screen.
  return <Redirect href="/home" />;
}
