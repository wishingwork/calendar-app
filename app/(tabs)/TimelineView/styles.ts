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
  bar: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.text,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  eventRow: {
    ...layout.row,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leftColumn: {
    width: '30%',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  verticalLine: {
    width: 2,
    height: 100,
    backgroundColor: colors.accent,
  },
  card: {
    width: '65%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  city: {
    fontSize: 12,
    color: '#999',
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
    fontSize: 12,
    color: colors.text,
  },
  temperature: {
    fontSize: 14,
    color: '#777',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  noEventsText: {
    fontSize: 18,
    color: colors.primary,
  },
});

export default styles;
