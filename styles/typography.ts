import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subheader: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  input: {
    fontFamily: 'SpaceMono-Regular',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
});
