import React from 'react';
import { Mail, Building, Calendar, BookOpen, Target, User } from 'lucide-react';
import { ProfileUser } from '../../../types/profile';

interface UserInfoProps {
  user: ProfileUser;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStudiesTypeDisplayName = (type: string) => {
    const types: Record<string, string> = {
      'BACHELOR': 'Licencjackie',
      'ENGINEERING': 'Inżynierskie',
      'MASTER': 'Magisterskie',
      'DOCTORATE': 'Doktoranckie',
      'POST-GRADUATE': 'Podyplomowe',
      'OTHER': 'Inne'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Podstawowe informacje */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Informacje podstawowe</span>
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Building className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Wydział</div>
              <div className="font-medium">{user.faculty}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Informacje o studencie */}
      {user.role === 'STUDENT' && user.student && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Informacje o studiach</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[var(--o-blue)] rounded-full flex-shrink-0"></div>
              <div>
                <div className="text-sm text-gray-500">Rodzaj studiów</div>
                <div className="font-medium">
                  {getStudiesTypeDisplayName(user.student.studiesType)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Data rozpoczęcia</div>
                <div className="font-medium">
                  {formatDate(user.student.studiesStartDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Kierunek</div>
                <div className="font-medium">{user.student.degree}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informacje o promotorze */}
      {user.role === 'SUPERVISOR' && user.supervisor && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Informacje o promotorze</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[var(--o-yellow)] rounded-full flex-shrink-0"></div>
              <div>
                <div className="text-sm text-gray-500">Tytuł naukowy</div>
                <div className="font-medium">{user.supervisor.academicTitle}</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Target className="w-4 h-4 text-gray-500 mt-1" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Zainteresowania naukowe</div>
                <div className="font-medium whitespace-pre-wrap">
                  {user.supervisor.selfInterests || 'Brak podanych zainteresowań'}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[var(--o-blue)]">
                    {user.supervisor.thesisList?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Prowadzone prace</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--o-green)]">
                    {user.supervisor.thesisLimit - (user.supervisor.thesisList?.length || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Wolne miejsca</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;