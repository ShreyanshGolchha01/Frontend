import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  loadingText?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  loadingText = 'Loading...',
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        loading && styles.disabledButton,
        style,
      ]}
      disabled={loading}
      {...props}
    >
      <LinearGradient
        colors={variant === 'primary' ? 
          COLORS.gradients.primary.colors : 
          ['#ffffff', '#f8fafc']}
        start={variant === 'primary' ? 
          COLORS.gradients.primary.start : 
          { x: 0, y: 0 }}
        end={variant === 'primary' ? 
          COLORS.gradients.primary.end : 
          { x: 0, y: 1 }}
        style={styles.gradientButton}
      >
        {loading ? (
          <>
            <ActivityIndicator 
              size="small" 
              color={variant === 'primary' ? COLORS.white : COLORS.primary} 
              style={styles.spinner} 
            />
            <Text style={[
              styles.buttonText, 
              variant === 'secondary' && styles.secondaryButtonText
            ]}>
              {loadingText}
            </Text>
          </>
        ) : (
          <Text style={[
            styles.buttonText, 
            variant === 'secondary' && styles.secondaryButtonText
          ]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
    elevation: 6,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  spinner: {
    marginRight: SPACING.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default CustomButton;
