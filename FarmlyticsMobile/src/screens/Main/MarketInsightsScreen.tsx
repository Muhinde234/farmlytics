import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme'; // ADDED: Import defaultTheme

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
`;

const MarketInsightsScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <CustomHeader title={t('tab.market') || 'Market Insights'} />
      <Text style={{ color: defaultTheme.colors.text }}>{t('tab.market')} Content Coming Soon!</Text>
    </Container>
  );
};

export default MarketInsightsScreen;