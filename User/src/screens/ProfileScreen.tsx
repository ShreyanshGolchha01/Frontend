import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { userAPI, handleAPIError } from '../services/api';

interface ProfileScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onLogout }) => {
  // Real employee data from backend - will be populated from API
  const [employeeData, setEmployeeData] = useState({
    id: '',
    name: '',
    designation: '',
    department: '',
    employeeId: '',
    phoneNumber: '',
    email: '',
    address: '',
    dateOfJoining: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  // Real family members data from backend - will be populated from API
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user profile data from backend
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      // Get user profile data
      const profileResponse = await userAPI.getProfile();
      if (profileResponse.success) {
        setEmployeeData(profileResponse.data);
      }

      // Get family members data (from health records)
      const healthResponse = await userAPI.getHealthRecords();
      if (healthResponse.success && healthResponse.data.familyMembers) {
        setFamilyMembers(healthResponse.data.familyMembers || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    age: '',
    bloodGroup: '',
    phoneNumber: '',
    aadharNumber: ''
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.relation && newMember.age) {
      const member = {
        id: familyMembers.length + 1,
        ...newMember,
        age: parseInt(newMember.age),
        healthId: `FAM00${familyMembers.length + 1}`
      };
      setFamilyMembers([...familyMembers, member]);
      setNewMember({
        name: '',
        relation: '',
        age: '',
        bloodGroup: '',
        phoneNumber: '',
        aadharNumber: ''
      });
      setShowAddMemberModal(false);
      Alert.alert('सफलता', 'परिवारिक सदस्य सफलतापूर्वक जोड़ा गया।');
    } else {
      Alert.alert('त्रुटि', 'कृपया सभी आवश्यक फील्ड भरें।');
    }
  };

  const renderEmployeeDetails = () => (
    <LinearGradient
      colors={COLORS.gradients.card.colors}
      start={COLORS.gradients.card.start}
      end={COLORS.gradients.card.end}
      style={styles.employeeCard}
    >
      <View style={styles.employeeHeader}>
        <LinearGradient
          colors={COLORS.gradients.primary.colors}
          start={COLORS.gradients.primary.start}
          end={COLORS.gradients.primary.end}
          style={styles.employeeAvatar}
        >
          <FontAwesome5 name="user" size={40} color={COLORS.white} />
        </LinearGradient>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{employeeData.name}</Text>
          <Text style={styles.employeeDesignation}>{employeeData.designation}</Text>
          <Text style={styles.employeeDepartment}>{employeeData.department}</Text>
        </View>
        <LinearGradient
          colors={['#27ae60', '#2ecc71']}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>सक्रिय</Text>
        </LinearGradient>
      </View>

      <View style={styles.employeeDetails}>
        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '10']}
            style={styles.detailIcon}
          >
            <FontAwesome5 name="id-badge" size={16} color={COLORS.primary} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>कर्मचारी ID</Text>
            <Text style={styles.detailValue}>{employeeData.employeeId}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.healthBlue + '20', COLORS.healthBlue + '10']}
            style={styles.detailIcon}
          >
            <Ionicons name="call" size={16} color={COLORS.healthBlue} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>फोन नंबर</Text>
            <Text style={styles.detailValue}>{employeeData.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.accent + '20', COLORS.accent + '10']}
            style={styles.detailIcon}
          >
            <MaterialIcons name="email" size={16} color={COLORS.accent} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>ईमेल</Text>
            <Text style={styles.detailValue}>{employeeData.email}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.healthGreen + '20', COLORS.healthGreen + '10']}
            style={styles.detailIcon}
          >
            <Ionicons name="location" size={16} color={COLORS.healthGreen} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>पता</Text>
            <Text style={styles.detailValue}>{employeeData.address}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.warning + '20', COLORS.warning + '10']}
            style={styles.detailIcon}
          >
            <Ionicons name="calendar" size={16} color={COLORS.warning} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>ज्वाइनिंग डेट</Text>
            <Text style={styles.detailValue}>{employeeData.dateOfJoining}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <LinearGradient
            colors={[COLORS.error + '20', COLORS.error + '10']}
            style={styles.detailIcon}
          >
            <FontAwesome5 name="tint" size={16} color={COLORS.error} />
          </LinearGradient>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>ब्लड ग्रुप</Text>
            <Text style={styles.detailValue}>{employeeData.bloodGroup}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderFamilyMember = (member: any) => (
    <LinearGradient
      key={member.id}
      colors={COLORS.gradients.card.colors}
      start={COLORS.gradients.card.start}
      end={COLORS.gradients.card.end}
      style={styles.familyMemberCard}
    >
      <View style={styles.memberHeader}>
        <LinearGradient
          colors={COLORS.gradients.accent.colors}
          start={COLORS.gradients.accent.start}
          end={COLORS.gradients.accent.end}
          style={styles.memberAvatar}
        >
          <FontAwesome5 
            name={member.relation === 'पत्नी' ? 'female' : 
                  member.relation === 'पुत्र' ? 'male' : 
                  member.relation === 'पुत्री' ? 'female' : 'user'} 
            size={24} 
            color={COLORS.white} 
          />
        </LinearGradient>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRelation}>{member.relation}</Text>
        </View>
        <View style={styles.memberAge}>
          <Text style={styles.ageText}>{member.age} वर्ष</Text>
        </View>
      </View>

      <View style={styles.memberDetails}>
        <View style={styles.memberDetailRow}>
          <FontAwesome5 name="tint" size={14} color={COLORS.error} />
          <Text style={styles.memberDetailText}>ब्लड ग्रुप: {member.bloodGroup}</Text>
        </View>
        
        {member.phoneNumber && (
          <View style={styles.memberDetailRow}>
            <Ionicons name="call" size={14} color={COLORS.healthBlue} />
            <Text style={styles.memberDetailText}>फोन: {member.phoneNumber}</Text>
          </View>
        )}
        
        <View style={styles.memberDetailRow}>
          <FontAwesome5 name="id-card" size={14} color={COLORS.primary} />
          <Text style={styles.memberDetailText}>आधार: {member.aadharNumber}</Text>
        </View>
        
        <View style={styles.memberDetailRow}>
          <MaterialIcons name="assignment" size={14} color={COLORS.accent} />
          <Text style={styles.memberDetailText}>हेल्थ ID: {member.healthId}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.editMemberButton}
        onPress={() => Alert.alert('संपादित करें', `${member.name} की जानकारी संपादित करें`)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="edit" size={16} color={COLORS.primary} />
        <Text style={styles.editMemberText}>संपादित करें</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderAddMemberModal = () => (
    <Modal
      visible={showAddMemberModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddMemberModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={COLORS.gradients.card.colors}
          start={COLORS.gradients.card.start}
          end={COLORS.gradients.card.end}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>नया सदस्य जोड़ें</Text>
            <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
              <AntDesign name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>नाम *</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.name}
                onChangeText={(text) => setNewMember({...newMember, name: text})}
                placeholder="पूरा नाम दर्ज करें"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>रिश्ता *</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.relation}
                onChangeText={(text) => setNewMember({...newMember, relation: text})}
                placeholder="रिश्ता दर्ज करें (जैसे: पत्नी, पुत्र, पुत्री)"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>उम्र *</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.age}
                onChangeText={(text) => setNewMember({...newMember, age: text})}
                placeholder="उम्र दर्ज करें"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ब्लड ग्रुप</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.bloodGroup}
                onChangeText={(text) => setNewMember({...newMember, bloodGroup: text})}
                placeholder="ब्लड ग्रुप दर्ज करें (जैसे: A+, B-, O+)"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>फोन नंबर</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.phoneNumber}
                onChangeText={(text) => setNewMember({...newMember, phoneNumber: text})}
                placeholder="फोन नंबर दर्ज करें"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>आधार नंबर</Text>
              <TextInput
                style={styles.textInput}
                value={newMember.aadharNumber}
                onChangeText={(text) => setNewMember({...newMember, aadharNumber: text})}
                placeholder="आधार नंबर दर्ज करें"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAddMemberModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>रद्द करें</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddMember}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gradients.primary.colors}
                start={COLORS.gradients.primary.start}
                end={COLORS.gradients.primary.end}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>जोड़ें</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Employee Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>कर्मचारी विवरण</Text>
          {renderEmployeeDetails()}
        </View>

        {/* Family Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>परिवारिक सदस्य</Text>
            <TouchableOpacity 
              style={styles.addIconButton}
              onPress={() => setShowAddMemberModal(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gradients.primary.colors}
                start={COLORS.gradients.primary.start}
                end={COLORS.gradients.primary.end}
                style={styles.addIconGradient}
              >
                <AntDesign name="plus" size={18} color={COLORS.white} />
                <Text style={styles.addIconText}>नया सदस्य जोड़ें</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {familyMembers.map(renderFamilyMember)}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                'लॉगआउट',
                'क्या आप वाकई लॉगआउट करना चाहते हैं?',
                [
                  { text: 'रद्द करें', style: 'cancel' },
                  { text: 'लॉगआउट', style: 'destructive', onPress: onLogout }
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={COLORS.gradients.primary.colors}
              start={COLORS.gradients.primary.start}
              end={COLORS.gradients.primary.end}
              style={styles.logoutGradient}
            >
              <MaterialIcons name="logout" size={24} color={COLORS.white} />
              <Text style={styles.logoutText}>लॉगआउट करें</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderAddMemberModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addIconButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  addIconGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  addIconText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  employeeCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.large,
    elevation: 8,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  employeeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.medium,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  employeeDesignation: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  employeeDepartment: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
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
    fontWeight: FONTS.weights.bold,
  },
  employeeDetails: {
    marginTop: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },
  familyMemberCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 4,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  memberRelation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    fontWeight: FONTS.weights.medium,
  },
  memberAge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  ageText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  memberDetails: {
    marginBottom: SPACING.md,
  },
  memberDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  memberDetailText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  editMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  editMemberText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  modalForm: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[400],
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  addButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  logoutButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  logoutText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
});

export default ProfileScreen;
