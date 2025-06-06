import { StyleSheet } from 'react-native';

export const layout = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaced: {
    justifyContent: 'space-between',
  },
  fullWidth: {
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
});
