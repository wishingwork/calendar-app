
import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  onScrollToBottom: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onClose, onScrollToBottom }) => {
  const { i18n } = useTranslation();
  const policyZh = require('../../assets/PrivacyPolicy/PrivacyPolicies.zh.html');
  const policyEn = require('../../assets/PrivacyPolicy/PrivacyPolicies.en.html');
  const policyHtml = i18n.language === 'zh' ? policyZh : policyEn;

  const onScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isCloseToBottom) {
      onScrollToBottom();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <WebView
            originWhitelist={['*']}
            source={policyHtml}
            onScroll={onScroll}
            javaScriptEnabled
            androidLayerType='hardware'
            allowFileAccess
            domStorageEnabled
            mixedContentMode='always'
            allowUniversalAccessFromFileURLs            
          />
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '80%',
    width: '90%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PrivacyPolicyModal;
