import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { common } from '../../styles/common';

const styles = StyleSheet.create({
  container: {
    ...common.container,
    padding: 24,
    backgroundColor: 'rgb(250 248 244 / var(--tw-bg-opacity, 1))',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 18,
    color: colors.text,
    marginRight: 6,
  },
  tzText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  label: {
    marginTop: 18,
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 17,
    color: '#222',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    minWidth: 240,
    alignItems: 'center',
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#d11a2a',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default styles;
