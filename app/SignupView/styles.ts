import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { common } from '../../styles/common';

const styles = StyleSheet.create({
  container: {
    ...common.container,
  },
  inner: {
    flex: 1,
  },
  logo: {
    ...typography.logo,
    marginBottom: 24,
  },
  input: {
    ...common.input,
  },
  button: {
    ...common.button,
    backgroundColor: colors.secondary,
  },
  buttonText: {
    ...common.buttonText,
  },
  link: {
    ...typography.link,
    marginTop: 12,
  },
  error: {
    ...typography.error,
    marginBottom: 8,
  },
});

export default styles;
