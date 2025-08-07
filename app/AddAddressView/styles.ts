import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // 1/3 of the screen
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
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
  webview: {
    flex: 0.5, // 1/3 of the screen,
    marginTop: 10,
  },
});

export default styles;
