import { doc, setDoc } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import OnboardLayout from '../../components/Layouts/OnboardLayout';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import OnboardHeader from '../../components/ui/OnboardHeader';

const BirthDateInput = ({
  onChange,
  placeholder,
  maxLength,
  label,
  ref,
}: {
  ref?: React.MutableRefObject<null>;
  label: string;
  placeholder?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}) => {
  return (
    <View className='flex-1 mx-2'>
      <Text className='text-white'>{label}</Text>
      <TextInput
        className='bg-dark-400 rounded-md p-4 text-white'
        keyboardType='numeric'
        ref={ref ?? null}
        maxLength={maxLength}
        onChangeText={onChange}
        placeholder={placeholder}
        returnKeyType='next'
      />
    </View>
  );
};

export default function InputBirthDate() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const router = useRouter();
  const { authUser } = useAuth();

  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(parseInt(year), parseInt(month), parseInt(day));
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const chooseAge = async () => {
    if (!authUser) {
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', authUser?.uid),
        {
          age: calculateAge(),
          birthDate: new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          ),
          authStep: 'gender',
        },
        { merge: true }
      );

      router.push('/inputGender');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  const onDayChange = (value: string) => {
    setDay(value);
    if (value.length === 2 && monthRef.current) {
      // @ts-expect-error
      monthRef.current.focus();
    }
  };

  const onMonthChange = (value: string) => {
    setMonth(value);
    if (value.length === 2 && yearRef.current) {
      // @ts-expect-error
      yearRef.current.focus();
    }
  };

  const onYearChange = (value: string) => {
    setYear(value);
    if (value.length === 4) {
      // @ts-expect-error
      yearRef.current?.blur();
    }
  };

  return (
    <OnboardLayout>
      <Stack.Screen
        options={{
          title: 'Your birthday',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back} text='Back' />
          ),
        }}
      />
      <OnboardHeader
        title="When's your birthday?"
        subtitle='Dont lie weirdo.'
      />
      <View>
        <View className='flex-row items-center justify-between gap-2'>
          <View className='flex-1 mx-2'>
            <Text className='text-white'>Day</Text>
            <TextInput
              className='bg-dark-400 rounded-md p-4 text-white'
              keyboardType='numeric'
              maxLength={2}
              onChangeText={onDayChange}
              placeholder='DD'
              autoComplete='birthdate-day'
              returnKeyType='next'
            />
          </View>
          <View className='flex-1 mx-2'>
            <Text className='text-white'>Month</Text>
            <TextInput
              ref={monthRef}
              className='bg-dark-400 rounded-md p-4 text-white'
              keyboardType='numeric'
              maxLength={2}
              onChangeText={onMonthChange}
              autoComplete='birthdate-month'
              placeholder='MM'
              returnKeyType='next'
            />
          </View>
          <View className='flex-1 mx-2'>
            <Text className='text-white'>Year</Text>
            <TextInput
              ref={yearRef}
              className='bg-dark-400 rounded-md p-4 text-white'
              keyboardType='numeric'
              maxLength={4}
              onChangeText={onYearChange}
              autoComplete='birthdate-year'
              placeholder='YYYY'
              returnKeyType='next'
            />
          </View>
        </View>
        <TouchableOpacity
          className='bg-light-500 w-full py-6 rounded-md items-center mt-32'
          onPress={chooseAge}
        >
          <Text className='text-dark-500 font-akira-expanded'>Continue</Text>
        </TouchableOpacity>
      </View>
    </OnboardLayout>
  );
}
