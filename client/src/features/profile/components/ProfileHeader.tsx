import React from 'react';
import { Button } from '../../../components/ui/button';
import { Edit, Mail, Building } from 'lucide-react';
import { ProfileUser } from '../../../types/profile';

interface ProfileHeaderProps {
  user: ProfileUser;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile = false, onEditProfile }) => {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'Student';
      case 'SUPERVISOR':
        return 'Promotor';
      case 'ADMIN':
        return 'Administrator';
      default:
        return role;
    }
  };

  const getAvatarInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSendMessage = () => {
    // TODO: Przekieruj do czatów lub otwórz modal wiadomości
    console.log('Wyślij wiadomość do:', user._id);
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-[var(--o-blue)] rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {getAvatarInitials(user.firstName, user.lastName)}
          </div>
          
          {/* Podstawowe informacje */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-[var(--o-blue)] rounded-full"></span>
                <span className="font-medium">{getRoleDisplayName(user.role)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{user.faculty}</span>
              </div>
            </div>
            
            {/* Dodatkowe informacje dla promotora */}
            {user.role === 'SUPERVISOR' && user.supervisor && (
              <div className="mt-2 text-gray-600">
                <span className="font-medium">{user.supervisor.academicTitle}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Akcje */}
        <div className="flex items-center space-x-3">
          {!isOwnProfile && (
            <Button variant="outline" size="sm" onClick={handleSendMessage}>
              <Mail className="w-4 h-4 mr-2" />
              Wyślij wiadomość
            </Button>
          )}
          
          {isOwnProfile && (
            <Button variant="default" size="sm" onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edytuj profil
            </Button>
          )}
        </div>
      </div>
      
      {/* Statystyki */}
      <div className="mt-6 flex items-center space-x-8 pt-4  border-gray-200">
        {/* {user.role === 'STUDENT' && user.student && (
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--o-blue)]">
              {user.student.thesisList?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Prace dyplomowe</div>
          </div>
        )} */}

      </div>
    </div>
  );
};

export default ProfileHeader;