import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { common } from '../../../styles/common';
import { layout } from '../../../styles/layout';

const styles = StyleSheet.create({
  container: {
    ...common.container,
    padding: 16,
    backgroundColor: 'rgb(250 248 244 / var(--tw-bg-opacity, 1))',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  city: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  weatherRow: {
    ...layout.row,
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  weather: {
    fontSize: 14,
    color: colors.text,
  },
  temperature: {
    fontSize: 14,
    color: '#777',
  },
});

export default styles;
