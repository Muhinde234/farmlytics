
import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { defaultTheme } from '../config/theme'; 
import LanguageSelector from './LanguageSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const StatusBarSpacer = styled(View)<{ height: number }>`
  height: ${props => props.height}px;
  background-color: ${defaultTheme.colors.primary}; /* Match header background */
`;

const HeaderContainer = styled(View)`
  background-color: ${props => props.theme.colors.primary};
  padding-horizontal: ${props => props.theme.spacing.medium}px;
  padding-vertical: ${props => props.theme.spacing.small}px;
  /* NO paddingTop here, it's handled by StatusBarSpacer above */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: ${props => props.theme.borderRadius.medium}px;
  border-bottom-right-radius: ${props => props.theme.borderRadius.medium}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

const LeftSection = styled(View)`
  flex-direction: row;
  align-items: center;
  min-width: 60px; /* Ensure space for potential back button or logo */
`;

const BackButton = styled(TouchableOpacity)`
  padding: ${props => props.theme.spacing.tiny}px;
  margin-right: ${defaultTheme.spacing.small}px;
`;

const HeaderLogo = styled(Image)`
  width: 30px; /* Small logo in header */
  height: 30px;
  resize-mode: contain;
  margin-right: ${defaultTheme.spacing.small}px;
`;

const TitleText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
  flex: 1; /* Allows title to center if other elements are fixed width */
  text-align: center;
`;

const RightSection = styled(View)`
  flex-direction: row;
  align-items: center;
  min-width: 60px; /* Ensure space for action buttons */
  justify-content: flex-end; /* Push content to the right */
`;

interface CustomHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showLanguageSwitcher?: boolean;
  rightAction?: {
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBack = false,
  showLogo = true,
  showLanguageSwitcher = false,
  rightAction,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: defaultTheme.colors.primary }}>
      <StatusBarSpacer height={insets.top} />
      <HeaderContainer>
        <LeftSection>
          {showBack && navigation.canGoBack() ? (
            <BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
            </BackButton>
          ) : showLogo ? (
            <HeaderLogo source={require('../../assets/logo.png')} />
          ) : (
            <View style={{ width: 40 }} />
          )}
        </LeftSection>
        <TitleText>{String(title || t('common.back'))}</TitleText> 
        <RightSection>
          {showLanguageSwitcher && <LanguageSelector variant="header" color={defaultTheme.colors.lightText} />}
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={{ marginLeft: defaultTheme.spacing.small }}>
              <Ionicons name={rightAction.iconName} size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
            </TouchableOpacity>
          )}
          {!showLanguageSwitcher && !rightAction && <View style={{ width: 40 }} />} 
        </RightSection>
      </HeaderContainer>
    </View>
  );
};

export default CustomHeader;
