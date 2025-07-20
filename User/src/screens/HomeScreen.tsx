import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import SchemesScreen from './SchemesScreen';
import ProfileScreen from './ProfileScreen';
import ReportDetailsScreen from './ReportDetailsScreen';
import NotificationScreen from './NotificationScreen';
import { adminAPI, reportsAPI, handleAPIError } from '../services/api';

interface HomeScreenProps {
  userName: string;
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userName, onLogout }) => {
  // Real data from backend - will be populated from API
  const [nextCamps, setNextCamps] = useState<any[]>([]);
  const [previousReports, setPreviousReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('home');
  const [showSchemes, setShowSchemes] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Add ref for auto scroll
  const flatListRef = React.useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch real data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch camps data
      const campsResponse = await adminAPI.getAllCamps();
      if (campsResponse.success) {
        // Filter upcoming camps
        const upcoming = campsResponse.camps?.filter((camp: any) => {
          const campDate = new Date(camp.date);
          const today = new Date();
          return campDate >= today;
        }) || [];
        setNextCamps(upcoming);
      }

      // Fetch user reports
      const reportsResponse = await reportsAPI.getUserReports();
      if (reportsResponse.success) {
        // Filter previous reports
        const previous = reportsResponse.reports?.filter((report: any) => {
          const reportDate = new Date(report.date);
          const today = new Date();
          return reportDate < today;
        }) || [];
        setPreviousReports(previous);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll function - disabled
  // React.useEffect(() => {
  //   const scrollInterval = setInterval(() => {
  //     if (flatListRef.current && nextCamps.length > 0) {
  //       const nextIndex = (currentIndex + 1) % nextCamps.length;
  //       flatListRef.current.scrollToIndex({
  //         index: nextIndex,
  //         animated: true,
  //       });
  //       setCurrentIndex(nextIndex);
  //     }
  //   }, 3500); // Change slide every 4 seconds

  //   return () => clearInterval(scrollInterval);
  // }, [currentIndex]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / 360); // 360 is the card width
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
  };

  const renderContent = () => {
    if (showNotifications) {
      return <NotificationScreen onBack={() => setShowNotifications(false)} />;
    }
    
    if (showReportDetails) {
      return <ReportDetailsScreen onBack={() => setShowReportDetails(false)} reportData={selectedReport} />;
    }
    
    if (showSchemes) {
      return <SchemesScreen onBack={() => setShowSchemes(false)} />;
    }
    
    if (showReports) {
      return <ReportDetailsScreen onBack={() => setShowReports(false)} reportData={null} />;
    }
    
    if (showProfile) {
      return <ProfileScreen onBack={() => setShowProfile(false)} onLogout={onLogout} />;
    }

    // Default home content - यह तब show होगा जब सभी screens false हों
    return (
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>नमस्ते,</Text>
          <Text style={styles.userName}>{userName.split(' ')[0]} जी</Text>
        </View>

        {/* Next Camps Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>आगामी शिविर</Text>
          <FlatList
            ref={flatListRef}
            data={nextCamps}
            renderItem={renderCampCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.campsList}
            onScroll={handleScroll}
            snapToAlignment="center"
            snapToInterval={310 + SPACING.md} // Card width + margin
            decelerationRate={0.8}
            snapToOffsets={nextCamps.map((_, index) => index * (310 + SPACING.md))}
            onScrollToIndexFailed={() => {}}
            pagingEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>

        {/* Previous Reports Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>पिछली रिपोर्ट्स</Text>
            <TouchableOpacity 
              onPress={() => setShowReportDetails(true)}
              style={styles.moreTextButton}
            >
              <Text style={styles.moreButtonText}>अधिक</Text>
              <MaterialIcons name="chevron-right" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={previousReports}
            renderItem={renderReportCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reportsList}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
    );
  };

  const renderCampCard = ({ item }: { item: any }) => (
    <LinearGradient
      colors={COLORS.gradients.card.colors}
      start={COLORS.gradients.card.start}
      end={COLORS.gradients.card.end}
      style={styles.campCard}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.campDate}>{item.date}</Text>
        <LinearGradient
          colors={COLORS.gradients.accent.colors}
          start={COLORS.gradients.accent.start}
          end={COLORS.gradients.accent.end}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>नया</Text>
        </LinearGradient>
      </View>
      <Text style={styles.campType}>{item.type}</Text>
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '10']}
            style={styles.iconContainer}
          >
            <Ionicons name="location" size={16} color={COLORS.primary} />
          </LinearGradient>
          <Text style={styles.campLocation}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <LinearGradient
            colors={[COLORS.healthGreen + '20', COLORS.healthGreen + '10']}
            style={styles.iconContainer}
          >
            <FontAwesome5 name="user-md" size={14} color={COLORS.healthGreen} />
          </LinearGradient>
          <Text style={styles.campDoctor}>{item.doctor}</Text>
        </View>
        <View style={styles.infoRow}>
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '10']}
            style={styles.iconContainer}
          >
            <Ionicons name="time" size={16} color={COLORS.primary} />
          </LinearGradient>
          <Text style={styles.campTime}>{item.time}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const getReportIconAndColor = (reportType: string) => {
    if (reportType.includes('व्यापक')) {
      return {
        icon: 'medical-services',
        colors: ['#8B5DFF', '#6B46C1'] as [string, string], // Purple
      };
    } else if (reportType.includes('संपूर्ण') || reportType.includes('पारिवारिक')) {
      return {
        icon: 'medical-services',
        colors: ['#3B82F6', '#1E40AF'] as [string, string], // Blue
      };
    } else if (reportType.includes('मल्टी') || reportType.includes('स्पेशलिटी')) {
      return {
        icon: 'medical-services',
        colors: ['#10B981', '#047857'] as [string, string], // Green
      };
    } else {
      return {
        icon: 'medical-services',
        colors: ['#F59E0B', '#D97706'] as [string, string], // Orange
      };
    }
  };

  const renderReportCard = ({ item }: { item: any }) => {
    const { icon, colors } = getReportIconAndColor(item.type);
    
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedReport(item);
          setShowReportDetails(true);
        }}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportIconContainer}>
            <LinearGradient
              colors={colors}
              style={styles.reportIcon}
            >
              <MaterialIcons name={icon as any} size={24} color="white" />
            </LinearGradient>
          </View>
          <LinearGradient
            colors={item.status === 'सामान्य' ? ['#10B981', '#047857'] : ['#F59E0B', '#D97706']}
            style={styles.statusIndicator}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </LinearGradient>
        </View>
        <View style={styles.reportContent}>
          <Text style={styles.reportTitle} numberOfLines={2}>{item.type}</Text>
          <View style={styles.reportInfo}>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={16} color={COLORS.textSecondary} />
              <Text style={styles.reportSubtitle} numberOfLines={1}>{item.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={16} color={COLORS.textSecondary} />
              <Text style={styles.reportDescription} numberOfLines={1}>{item.doctor}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={16} color={COLORS.textSecondary} />
              <Text style={styles.reportDescription} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => {
            setSelectedReport(item);
            setShowReportDetails(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.detailButtonText}>विस्तृत देखें</Text>
          <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header with Navigation */}
      <LinearGradient
        colors={COLORS.gradients.primary.colors}
        start={COLORS.gradients.primary.start}
        end={COLORS.gradients.primary.end}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {showNotifications ? (
            // Header for notification screen with back button
            <>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowNotifications(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>सूचनाएं</Text>
              <View style={styles.headerSpacer} />
            </>
          ) : (
            // Normal header layout
            <>
              <Text style={styles.headerTitle}>
                {showNotifications ? 'सूचनाएं' :
                 showReportDetails ? 'विस्तृत रिपोर्ट' : 
                 showReports ? 'रिपोर्ट्स' :
                 showProfile ? 'प्रोफाइल' : 
                 showSchemes ? 'सरकारी योजनाएं' : 
                 'स्वास्थ्य पोर्टल'}
              </Text>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => {
                  setShowNotifications(true);
                  setActiveTab('home');
                  setShowSchemes(false);
                  setShowProfile(false);
                  setShowReports(false);
                  setShowReportDetails(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContainer}>
                  <Ionicons 
                    name={notificationCount > 0 ? "notifications" : "notifications-outline"} 
                    size={24} 
                    color={COLORS.white} 
                  />
                  {notificationCount > 0 && (
                    <LinearGradient
                      colors={['#e74c3c', '#c0392b']}
                      style={styles.notificationBadge}
                    >
                      <Text style={styles.notificationCount}>{notificationCount}</Text>
                    </LinearGradient>
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>

      {/* Dynamic Content */}
      {renderContent()}

      {/* Bottom Navigation - Hide when notification screen is open */}
      {!showNotifications && (
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
            onPress={() => {
              setActiveTab('home');
              setShowSchemes(false);
              setShowProfile(false);
              setShowReports(false);
              setShowReportDetails(false);
              setShowNotifications(false);
            }}
          >
            <Ionicons 
              name={activeTab === 'home' ? "home" : "home-outline"} 
              size={22} 
              color={activeTab === 'home' ? COLORS.primary : COLORS.textSecondary}
              style={[styles.navIcon, activeTab === 'home' && styles.activeNavIcon]} 
            />
            <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>होम</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'scheme' && styles.activeNavItem]}
            onPress={() => {
              setActiveTab('scheme');
              setShowSchemes(true);
              setShowProfile(false);
              setShowReports(false);
              setShowReportDetails(false);
              setShowNotifications(false);
            }}
          >
            <MaterialIcons 
              name="assignment" 
              size={22} 
              color={activeTab === 'scheme' ? COLORS.primary : COLORS.textSecondary}
              style={[styles.navIcon, activeTab === 'scheme' && styles.activeNavIcon]} 
            />
            <Text style={[styles.navText, activeTab === 'scheme' && styles.activeNavText]}>योजना</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]}
            onPress={() => {
              setActiveTab('reports');
              setShowReports(true);
              setShowSchemes(false);
              setShowProfile(false);
              setShowReportDetails(false);
              setShowNotifications(false);
            }}
          >
            <MaterialIcons 
              name="description" 
              size={22} 
              color={activeTab === 'reports' ? COLORS.primary : COLORS.textSecondary}
              style={[styles.navIcon, activeTab === 'reports' && styles.activeNavIcon]} 
            />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>रिपोर्ट्स</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
            onPress={() => {
              setActiveTab('profile');
              setShowProfile(true);
              setShowSchemes(false);
              setShowReports(false);
              setShowReportDetails(false);
              setShowNotifications(false);
            }}
          >
            <Ionicons 
              name={activeTab === 'profile' ? "person" : "person-outline"} 
              size={22} 
              color={activeTab === 'profile' ? COLORS.primary : COLORS.textSecondary}
              style={[styles.navIcon, activeTab === 'profile' && styles.activeNavIcon]} 
            />
            <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>प्रोफाइल</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xxl,
    // paddingBottom: SPACING.l,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  headerSpacer: {
    width: 48, // Same width as back button to center the title
  },
  notificationButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  notificationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    // Icon styling handled by vector icon props
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOWS.small,
  },
  notificationCount: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  welcomeSection: {
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  userName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  moreButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  moreTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  moreButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  campsList: {
    paddingRight: SPACING.lg,
  },
  campCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    width: 310,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(205, 204, 204, 0.63)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.semibold,
  },
  cardInfo: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  iconContainerSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
    ...SHADOWS.small,
  },
  iconContainerTiny: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs / 2,
    ...SHADOWS.small,
  },
  infoIcon: {
    // Icon styling handled by vector icon props
  },
  campDate: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: 0,
  },
  campType: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  campLocation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  campDoctor: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
    fontWeight: FONTS.weights.medium,
  },
  campTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportsList: {
    paddingBottom: SPACING.lg,
  },
  reportCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '85%',
    aspectRatio: 1,
    marginHorizontal: '7.5%',
    marginBottom: SPACING.md,
    borderWidth: 0.4,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    ...SHADOWS.large,
    elevation: 6,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  reportIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  statusIndicator: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  reportInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  reportSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  reportDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.md,
    alignSelf: 'center',
  },
  detailButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
    marginRight: SPACING.xs,
  },
  statusIndicatorCompact: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
  },
  reportInfoCompact: {
    marginBottom: SPACING.sm,
    flex: 1,
  },
  infoRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  reportType: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs,
  },
  reportTypeCompact: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs / 2,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  reportStatus: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  reportStatusCompact: {
    fontSize: 9,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  reportDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportDateSmall: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportDateTiny: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
    fontWeight: FONTS.weights.medium,
  },
  reportDoctor: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportDoctorSmall: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  reportDoctorTiny: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
    fontWeight: FONTS.weights.medium,
  },
  reportTimeTiny: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  reportAttentionTiny: {
    fontSize: 9,
    color: COLORS.warning,
    fontStyle: 'italic',
  },
  dateTimeContainer: {
    flex: 1,
  },
  doctorContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: SPACING.xs,
  },
  reportLocation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  viewReportButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
  },
  viewReportButtonSmall: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    marginTop: SPACING.xs,
  },
  viewReportButtonTiny: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
  },
  viewReportText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  viewReportTextSmall: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  viewReportTextTiny: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    ...SHADOWS.small,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: 50,
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 60,
  },
  activeNavItem: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    borderRadius: 50,
  },
  navIcon: {
    marginBottom: SPACING.xs,
  },
  activeNavIcon: {
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  activeNavText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
});

export default HomeScreen;
