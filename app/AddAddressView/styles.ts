import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { common } from '../../styles/common';

const styles = StyleSheet.create({
  container: {
    ...common.container,
    padding: 16,
    backgroundColor: 'rgb(250 248 244 / var(--tw-bg-opacity, 1))',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inner: {
    padding: 16,
    paddingBottom: 48,
    flex: 1,
  },    
  input: {
    ...common.input,
    width: '70%',
    marginRight: 10,
    marginBottom: 0,
  },
  searchButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  searchButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: 'gray',
    maxHeight: 150,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  selectedDropdownItem: {
    backgroundColor: colors.primary,
  },
  selectedDropdownItemText: {
    color: 'white',
  },
  webview: {
    flex: 1,
    marginTop: 10,
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },
  warning: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: colors.primary,
  },
});

export default styles;