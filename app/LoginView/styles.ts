import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { common } from '../../styles/common';

const styles = StyleSheet.create({
  container: {
    ...common.container,
  },
  inner: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 48,
  },
  logo: {
    ...typography.logo,
    marginBottom: 24,
  },
  featureBlock: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    textAlign: 'center',
  },
  featureText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  featureDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    ...common.input,
  },
  button: {
    ...common.button,
    backgroundColor: colors.primary,
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
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;
