import { KeyboardAvoidingView, Platform, View } from 'react-native';

interface OnboardLayoutProps {
  children: React.ReactNode;
}

export default function OnboardLayout({ children }: OnboardLayoutProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className='justify-between flex-1 p-6 bg-dark-500'>{children}</View>
    </KeyboardAvoidingView>
  );
}
