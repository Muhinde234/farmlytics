// src/components/LanguageSelector.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Platform, Text, View } from 'react-native';

const LanguageContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.medium}px; /* Explicitly 'px' string */
`;

const LanguageButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding-horizontal: ${props => props.theme.spacing.medium}px; /* Explicitly 'px' string */
  padding-vertical: ${props => props.theme.spacing.small}px; /* Explicitly 'px' string */
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px; /* Explicitly 'px' string */
  margin-horizontal: ${props => props.theme.spacing.tiny}px; /* Explicitly 'px' string */
  border-width: 1px; /* Explicitly 'px' string */
  border-color: ${props => props.theme.colors.border};
`;

const LanguageText = styled(Text)<{ selected: boolean }>`
  color: ${props => props.selected ? props.theme.colors.lightText : props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.small}px; /* Explicitly 'px' string */
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContainer>
      <LanguageButton selected={i18n.language === 'en'} onPress={() => changeLanguage('en')}>
        <LanguageText selected={i18n.language === 'en'}>EN</LanguageText>
      </LanguageButton>
      <LanguageButton selected={i18n.language === 'rw'} onPress={() => changeLanguage('rw')}>
        <LanguageText selected={i18n.language === 'rw'}>RW</LanguageText>
      </LanguageButton>
      <LanguageButton selected={i18n.language === 'fr'} onPress={() => changeLanguage('fr')}>
        <LanguageText selected={i18n.language === 'fr'}>FR</LanguageText>
      </LanguageButton>
    </LanguageContainer>
  );
};

export default LanguageSelector;