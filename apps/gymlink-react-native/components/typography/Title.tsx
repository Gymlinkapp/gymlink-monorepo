import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text } from 'react-native';

const titleStyle = cva('font-akira-expanded text-white', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
});

interface TitleProps extends VariantProps<typeof titleStyle> {
  children: React.ReactNode;
  size: 'sm' | 'md' | 'lg';
}

export default function Title({ children, size, ...props }: TitleProps) {
  return (
    <Text {...props} className={titleStyle({ size })}>
      {children}
    </Text>
  );
}
