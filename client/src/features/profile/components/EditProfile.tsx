import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectItem } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Save, X } from 'lucide-react';
import { ProfileUser } from '../../../types/profile';
import { profileApi } from '../../../lib/api';
import {
  FACULTIES,
  STUDIES_TYPES,
  DEGREES,
} from "../../../../../shared/constants";
import type {
  Faculty,
  StudiesType,
  Degree,
} from "../../../../../shared/types";

interface EditProfileProps {
  user: ProfileUser;
  onSave: (updatedUser: ProfileUser) => void;
  onCancel: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  faculty: Faculty;
  // Student specific fields
  studiesType?: StudiesType;
  studiesStartDate?: string;
  degree?: string;
  // Supervisor specific fields
  academicTitle?: string;
  selfInterests?: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  studiesType: string;
  studiesStartDate: string;
  degree: string;
  academicTitle: string;
  selfInterests: string;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    faculty: user.faculty as Faculty || FACULTIES[0].value as Faculty,
    studiesType: user.student?.studiesType as StudiesType || '' as StudiesType,
    studiesStartDate: user.student?.studiesStartDate 
      ? new Date(user.student.studiesStartDate).toISOString().split('T')[0] 
      : '',
    degree: user.student?.degree || '',
    academicTitle: user.supervisor?.academicTitle || '',
    selfInterests: user.supervisor?.selfInterests || '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    faculty: '',
    studiesType: '',
    studiesStartDate: '',
    degree: '',
    academicTitle: '',
    selfInterests: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      faculty: '',
      studiesType: '',
      studiesStartDate: '',
      degree: '',
      academicTitle: '',
      selfInterests: '',
    };

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
      isValid = false;
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
      isValid = false;
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email jest wymagany';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Podaj prawidłowy adres email';
      isValid = false;
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Wydział jest wymagany';
      isValid = false;
    }

    // Student specific validation
    if (user.role === 'STUDENT') {
      if (!formData.studiesType) {
        newErrors.studiesType = 'Typ studiów jest wymagany';
        isValid = false;
      }
      if (!formData.studiesStartDate) {
        newErrors.studiesStartDate = 'Data rozpoczęcia studiów jest wymagana';
        isValid = false;
      }
      if (!formData.degree?.trim()) {
        newErrors.degree = 'Kierunek jest wymagany';
        isValid = false;
      }
    }

    // Supervisor specific validation
    if (user.role === 'SUPERVISOR') {
      if (!formData.academicTitle?.trim()) {
        newErrors.academicTitle = 'Tytuł naukowy jest wymagany';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to update profile...');
      console.log('Token exists:', !!localStorage.getItem("accessToken"));
      
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        faculty: formData.faculty,
      };

      if (user.role === 'STUDENT') {
        updateData.studentData = {
          studiesType: formData.studiesType,
          studiesStartDate: formData.studiesStartDate,
          degree: formData.degree,
        };
      }

      if (user.role === 'SUPERVISOR') {
        updateData.supervisorData = {
          academicTitle: formData.academicTitle,
          selfInterests: formData.selfInterests ? formData.selfInterests.split('\n') : [],
        };
      }

      console.log('Update data:', updateData);
      const updatedUser = await profileApi.updateProfile(updateData);
      console.log('Profile updated successfully:', updatedUser);
      onSave(updatedUser);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Wystąpił błąd podczas aktualizacji profilu'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edytuj profil</h2>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Anuluj
          </Button>
        </div>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Podstawowe dane */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dane podstawowe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię *
              </label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko *
              </label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wydział *
            </label>
            <Select
              value={formData.faculty}
              onValueChange={(value) => handleSelectChange('faculty', value)}
              error={!!errors.faculty}
              placeholder="Wybierz wydział"
              disabled={isLoading}
            >
              {FACULTIES.map((faculty) => (
                <SelectItem key={faculty.value} value={faculty.value}>
                  {faculty.label}
                </SelectItem>
              ))}
            </Select>
            {errors.faculty && (
              <p className="mt-1 text-sm text-red-500">{errors.faculty}</p>
            )}
          </div>
        </div>

        {/* Dane studenta */}
        {user.role === 'STUDENT' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dane o studiach
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Typ studiów *
                </label>
                <Select
                  value={formData.studiesType}
                  onValueChange={(value) => handleSelectChange('studiesType', value)}
                  error={!!errors.studiesType}
                  placeholder="Wybierz typ studiów"
                  disabled={isLoading}
                >
                  {STUDIES_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.studiesType && (
                  <p className="mt-1 text-sm text-red-500">{errors.studiesType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data rozpoczęcia studiów *
                </label>
                <Input
                  type="date"
                  name="studiesStartDate"
                  value={formData.studiesStartDate}
                  onChange={handleChange}
                  error={!!errors.studiesStartDate}
                  disabled={isLoading}
                />
                {errors.studiesStartDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.studiesStartDate}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kierunek *
              </label>
              <Input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                error={!!errors.degree}
                disabled={isLoading}
                placeholder="np. Informatyka"
              />
              {errors.degree && (
                <p className="mt-1 text-sm text-red-500">{errors.degree}</p>
              )}
            </div>
          </div>
        )}

        {/* Dane promotora */}
        {user.role === 'SUPERVISOR' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dane promotora
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tytuł naukowy *
              </label>
              <Input
                type="text"
                name="academicTitle"
                value={formData.academicTitle}
                onChange={handleChange}
                error={!!errors.academicTitle}
                disabled={isLoading}
                placeholder="np. dr, prof. dr hab."
              />
              {errors.academicTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.academicTitle}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zainteresowania naukowe
              </label>
              <Textarea
                name="selfInterests"
                value={formData.selfInterests}
                onChange={handleChange}
                error={!!errors.selfInterests}
                disabled={isLoading}
                placeholder="Opisz swoje zainteresowania naukowe..."
                rows={4}
              />
              {errors.selfInterests && (
                <p className="mt-1 text-sm text-red-500">{errors.selfInterests}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Każde zainteresowanie w nowej linii
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[var(--o-blue)] hover:bg-[var(--o-blue)]/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
