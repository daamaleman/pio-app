import type { ReactNode } from 'react';
import { Text as NativeText, TextInput as NativeTextInput, type TextInputProps, type TextProps } from 'react-native';

import { useAppState } from '@/lib/app-state';
import { toMiskituDraft } from '@/lib/miskitu-draft';

function translateChild(value: ReactNode): ReactNode {
  if (typeof value === 'string') return toMiskituDraft(value);
  if (Array.isArray(value)) return value.map(translateChild);
  return value;
}

/** Makes literal UI copy follow the selected language without changing user-entered values. */
export function Text({ children, ...props }: TextProps) {
  const { language } = useAppState();
  return <NativeText {...props}>{language === 'miq' ? translateChild(children) : children}</NativeText>;
}

/** Localizes only placeholder and accessibility copy; typed text remains exactly as entered. */
export function TextInput({ placeholder, accessibilityLabel, ...props }: TextInputProps) {
  const { language } = useAppState();
  const translate = (value?: string) => language === 'miq' && value ? toMiskituDraft(value) : value;
  return <NativeTextInput {...props} placeholder={translate(placeholder)} accessibilityLabel={translate(accessibilityLabel)} />;
}
