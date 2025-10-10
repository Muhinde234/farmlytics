// src/components/LanguageSelector.tsx

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Platform, Text, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // Ensure useTranslation is imported
import { defaultTheme } from '../config/theme'; // Import defaultTheme for consistent colors

const StandardLanguageContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const StandardLanguageButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding-horizontal: ${props => props.theme.spacing.medium}px;
  padding-vertical: ${props => props.theme.spacing.small}px;
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  margin-horizontal: ${props => props.theme.spacing.tiny}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const StandardLanguageText = styled(Text)<{ selected: boolean }>`
  color: ${props => props.selected ? props.theme.colors.lightText : props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.small}px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const HeaderLanguageButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.tiny}px;
  flex-direction: row;
  align-items: center;
`;

const ModalOverlay = styled(TouchableWithoutFeedback)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: flex-start;
  align-items: flex-end;
`;

const ModalContent = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  elevation: 10;
  shadow-color: '#000';
  shadow-offset: 0px 5px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  margin-top: ${Platform.OS === 'android' ? 50 : 80}px; /* Adjusted to generally be below status bar/notch */
  margin-right: ${props => props.theme.spacing.medium}px;
  width: 150px;
`;

const ModalItem = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ModalItemLast = styled(ModalItem)`
  border-bottom-width: 0;
`;

const ModalItemText = styled(Text)<{ selected: boolean }>`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

interface LanguageSelectorProps {
  variant?: 'standard' | 'header';
  color?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'standard', color = defaultTheme.colors.lightText }) => {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setModalVisible(false);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'rw', label: 'Kinyarwanda' },
    { code: 'fr', label: 'Français' },
  ];

  if (variant === 'header') {
    return (
      <View>
        <HeaderLanguageButton onPress={() => setModalVisible(true)}>
          <Ionicons name="language-outline" size={defaultTheme.fontSizes.xl} color={color} />
        </HeaderLanguageButton>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ModalOverlay onPress={() => setModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent>
                {languages.map((lang, index) => (
                  <View key={String(lang.code)}> {/* Explicit String() */}
                    {index !== 0 && <View style={{ height: 1, backgroundColor: defaultTheme.colors.border }} />}
                    <ModalItem
                      onPress={() => changeLanguage(lang.code)}
                      style={index === languages.length - 1 ? { borderBottomWidth: 0 } : {}}
                    >
                      <ModalItemText selected={i18n.language === lang.code}>{String(lang.label)}</ModalItemText> {/* Explicit String() */}
                      {i18n.language === lang.code && <Ionicons name="checkmark" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.primary} />}
                    </ModalItem>
                  </View>
                ))}
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>
      </View>
    );
  }

  return (
    <StandardLanguageContainer>
      {languages.map((lang) => (
        <StandardLanguageButton key={String(lang.code)} selected={i18n.language === lang.code} onPress={() => changeLanguage(lang.code)}>
          <StandardLanguageText selected={i18n.language === lang.code}>{String(lang.code.toUpperCase())}</StandardLanguageText> {/* Explicit String() */}
        </StandardLanguageButton>
      ))}
    </StandardLanguageContainer>
  );
};

export default LanguageSelector;