import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../../common/layout/MainLayout';
import ProfileHeader from '../components/ProfileHeader';
import UserInfo from '../components/UserInfo';
import ThesesList from '../components/ThesesList';
import EditProfile from '../components/EditProfile';
import { ProfileUser } from '../../../types/profile';
import { profileApi } from '../../../lib/api';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error('Musisz być zalogowany żeby zobaczyć profil');
        }
        
        const userData = userId 
          ? await profileApi.getUserProfile(userId)
          : await profileApi.getMyProfile();
          
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania profilu');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedUser: ProfileUser) => {
    setUser(updatedUser);
    setIsEditing(false);
    
    // Update localStorage if it's the current user's profile
    if (!userId) {
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        faculty: updatedUser.faculty,
      }));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Ładowanie profilu...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              {error || 'Nie udało się załadować profilu'}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[var(--o-blue)] text-white rounded-lg hover:opacity-90"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isOwnProfile = !userId; 

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {isEditing ? (
          <EditProfile 
            user={user} 
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            <ProfileHeader 
              user={user} 
              isOwnProfile={isOwnProfile}
              onEditProfile={handleEditProfile}
            />
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <UserInfo user={user} />
              </div>
              
              <div className="lg:col-span-2">
                <ThesesList 
                  user={user}
                  thesesIds={user.role === 'STUDENT' ? user.student?.thesisList : user.supervisor?.thesisList}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;