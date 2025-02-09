import { Text as RNText, TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface Props extends TextProps {
  variant?: 'body' | 'heading' | 'label' | 'title';
}

export function Text({ className, variant = 'body', ...props }: Props) {
  const baseStyle = 'text-base text-gray-900';
  const variantStyles = {
    body: 'font-crimson',
    heading: 'font-crimson-bold text-xl',
    label: 'font-courier text-sm',
    title: 'font-crimson-semibold text-lg',
  };

  return (
    <RNText
      className={twMerge(baseStyle, variantStyles[variant], className)}
      {...props}
    />
  );
}
