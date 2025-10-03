// src/components/CustomHeader.tsx

import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native'; // Import DefaultTheme
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { defaultTheme } from '../config/theme';

// Define Props for HeaderContainer if you were to pass custom props to it
// If we use props => props.theme.value in a styled component, `props` is implicitly typed
// However, when it's just a raw number, we can simply pass it directly.
const HeaderContainer = styled(View)`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.medium}px;
  padding-vertical: ${props => props.theme.spacing.medium}px;

  padding-top: ${Platform.OS === 'android' ? defaultTheme.spacing.medium : defaultTheme.spacing.xl}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: ${props => props.theme.borderRadius.medium}px;
  border-bottom-right-radius: ${props => props.theme.borderRadius.medium}px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

const TitleText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
  flex: 1;
  text-align: center;
`;

const BackButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.tiny}px;
`;

const EmptySpace = styled(View)`
  width: ${defaultTheme.fontSizes.xl + defaultTheme.spacing.tiny * 2}px;
`;

interface CustomHeaderProps {
  title?: string;
  showBack?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      {showBack && navigation.canGoBack() ? (
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
        </BackButton>
      ) : <EmptySpace />}
      <TitleText>{title || t('common.back')}</TitleText>
      <EmptySpace />
    </HeaderContainer>
  );
};

export default CustomHeader;