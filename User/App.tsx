/**
 * Government Health App - Login Screen (Expo Version)
 * @format
 */

import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CustomButton from './src/components/CustomButton';
import CustomInput from './src/components/CustomInput';
import HomeScreen from './src/screens/HomeScreen';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from './src/constants/theme';
import { userAPI, handleAPIError } from './src/services/api';

const { height } = Dimensions.get('window');

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const validateForm = () => {
    const newErrors = { phoneNumber: '', password: '' };
    let isValid = true;

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'फोन नंबर आवश्यक है';
      isValid = false;
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'पासवर्ड आवश्यक है';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Call real backend API
      const response = await userAPI.login({
        phoneNumber: phoneNumber,
        password: password
      });

      if (response.success) {
        // Successfully logged in
        const user = response.user;
        const fullName = `${user.firstName} ${user.lastName}`;
        setUserName(fullName);
        setIsLoggedIn(true);
        Alert.alert('सफल', `लॉगिन सफल! स्वागत है ${fullName}`);
      } else {
        // Login failed
        Alert.alert('त्रुटि', response.message || 'लॉगिन में समस्या हुई');
      }
    } catch (error) {
      // Handle network or other errors
      const errorMessage = handleAPIError(error);
      Alert.alert('त्रुटि', errorMessage || 'नेटवर्क की समस्या। कृपया दोबारा कोशिश करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber('');
    setPassword('');
    setUserName('');
    setErrors({ phoneNumber: '', password: '' });
  };

  // If user is logged in, show HomeScreen
  if (isLoggedIn) {
    return <HomeScreen userName={userName} onLogout={handleLogout} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
          <View style={styles.staticContainer}>
            {/* Header Section */}
            <LinearGradient
              colors={COLORS.gradients.primary.colors}
              start={COLORS.gradients.primary.start}
              end={COLORS.gradients.primary.end}
              style={styles.header}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={COLORS.gradients.card.colors}
                  start={COLORS.gradients.card.start}
                  end={COLORS.gradients.card.end}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>🏥</Text>
                </LinearGradient>
              </View>
              <Text style={styles.appTitle}>सरकारी स्वास्थ्य पोर्टल</Text>
              <Text style={styles.subtitle}>स्वास्थ्य सेवाओं तक सुरक्षित पहुंच</Text>
            </LinearGradient>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>स्वागत है</Text>
                <Text style={styles.welcomeSubtitle}>
                  कृपया अपने पंजीकृत फोन नंबर से साइन इन करें
                </Text>
              </View>

              <CustomInput
                label="फोन नंबर"
                placeholder="अपना 10-अंकीय फोन नंबर दर्ज करें"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/[^0-9]/g, ''));
                  if (errors.phoneNumber) {
                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
                autoComplete="tel"
                error={errors.phoneNumber}
              />

              <CustomInput
                label="पासवर्ड"
                placeholder="अपना पासवर्ड दर्ज करें"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                secureTextEntry
                autoComplete="password"
                error={errors.password}
              />

              <CustomButton
                title="साइन इन करें"
                loadingText="साइन इन हो रहा है..."
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                स्वास्थ्य और परिवार कल्याण मंत्रालय
              </Text>
              <Text style={styles.footerSubtext}>
                छत्तीसगढ़ सरकार की पहल
              </Text>
              <Text style={styles.versionText}>संस्करण 1.0.0</Text>
              <Text style={styles.poweredByText}>Powered by SSIPMT, RAIPUR</Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  staticContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: (StatusBar.currentHeight || 0) + SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
  },
  appTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[200],
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
  },
  welcomeContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  footerSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    width: '100%',
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  versionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    width: '100%',
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  poweredByText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: FONTS.weights.semibold,
  },
});
