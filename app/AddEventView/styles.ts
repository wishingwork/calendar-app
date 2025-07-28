import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { common } from '../../styles/common';

const styles = StyleSheet.create({
  container: {
    ...common.container,
    padding: 16,
    backgroundColor: 'rgb(250 248 244 / var(--tw-bg-opacity, 1))',
  },
  inner: {
    padding: 16,
    paddingTop: 48,
  },  
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    ...common.input,
    marginBottom: 16,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    width: '80%',
    height: 40,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 0,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },  
});

export default styles;
