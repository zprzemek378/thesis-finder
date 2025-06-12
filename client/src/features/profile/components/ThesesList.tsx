import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { BookOpen, Users, Tag, ExternalLink } from 'lucide-react';
import { ProfileUser } from '../../../types/profile';
import { Thesis } from '../../../types/thesis';
import { getThesisById } from '../../../lib/api';

interface ThesesListProps {
  user: ProfileUser;
  thesesIds?: string[];
}

const ThesesList: React.FC<ThesesListProps> = ({ user, thesesIds = [] }) => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheses = async () => {
      if (!thesesIds.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
          throw new Error('Brak tokenu autoryzacji');
        }
        
        const thesesPromises = thesesIds.map(async (thesisId) => {
          try {
            return await getThesisById(thesisId, token);
          } catch (error) {
            console.error(`Error fetching thesis ${thesisId}:`, error);
            return null;
          }
        });

        const thesesData = await Promise.all(thesesPromises);
        const validTheses = thesesData.filter((thesis): thesis is Thesis => thesis !== null);
        
        setTheses(validTheses);
      } catch (err) {
        setError('Nie udało się załadować prac dyplomowych');
        console.error('Error fetching theses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheses();
  }, [thesesIds]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'FREE': { label: 'Dostępna', className: 'bg-green-100 text-green-800' },
      'IN_PROGRESS': { label: 'W trakcie', className: 'bg-yellow-100 text-yellow-800' },
      'TAKEN': { label: 'Zajęta', className: 'bg-blue-100 text-blue-800' },
      'FINISHED': { label: 'Zakończona', className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FREE;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getTitle = () => {
    switch (user.role) {
      case 'STUDENT':
        return 'Moje prace dyplomowe';
      case 'SUPERVISOR':
        return 'Prowadzone prace';
      default:
        return 'Prace dyplomowe';
    }
  };

  const handleViewDetails = (thesisId: string) => {
    window.location.href = `#/thesis/${thesisId}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>{getTitle()}</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            Ładowanie prac dyplomowych...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>{getTitle()}</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>{getTitle()}</span>
          <span className="text-sm font-normal text-gray-500">
            ({theses.length})
          </span>
        </h3>
      </div>
      <div className="p-6">
        {theses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {user.role === 'STUDENT' 
              ? 'Nie masz jeszcze żadnych prac dyplomowych' 
              : 'Nie prowadzisz jeszcze żadnych prac'
            }
          </div>
        ) : (
          <div className="space-y-4">
            {theses.map((thesis) => (
              <div
                key={thesis._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-1">
                      {thesis.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {thesis.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    {getStatusBadge(thesis.status)}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(thesis._id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Szczegóły
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{thesis.degree}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {thesis.students?.length || 0}/{thesis.studentsLimit}
                    </span>
                  </div>
                </div>

                {thesis.tags && thesis.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {thesis.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThesesList;