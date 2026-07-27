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
  },
  logo: {
    ...typography.logo,
    marginBottom: 24,
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 16,
    width: '100%',
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.text || '#333',
    lineHeight: 26,
    marginBottom: 16,
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#007bff',
    textAlign: 'center',
  },
  link: {
    ...typography.link,
    marginTop: 12,
  },
});

export default styles;
