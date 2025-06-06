import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { typography } from '../../../styles/typography';
import { layout } from '../../../styles/layout';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    alignItems: 'center',
  },
  sectionHeader: {
    width: '100%',
    backgroundColor: colors.white,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionHeaderText: {
    ...typography.header,
    flex: 1,
  },
  sectionContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  fieldRow: {
    ...layout.row,
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 110,
    color: colors.text,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.white,
    marginLeft: 8,
    marginBottom: 0,
  },
  passwordInputs: {
    marginBottom: 16,
    width: '100%',
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
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  logoutText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
