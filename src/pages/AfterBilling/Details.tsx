import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Percent,
  GraduationCap,
  Clock,
  DollarSign,
  Code,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { businessCategories } from '../../utils/businessCategories';
import { AfterBillingDetailsFormData, Officer, Shareholder, Optionee, TechnologyDeveloper } from '../../types/AfterBillingDetails';

const initialFormData: AfterBillingDetailsFormData = {
  companyAddressPreference: {
    type: 'provided'
  },
  businessActivity: '',
  officers: [],
  shareholders: [],
  optionPool: {
    hasPool: false
  },
  optionees: [],
  vestingSchedule: '',
  compensationMethod: 'consultant',
  technologyDevelopers: []
};

const requiredOfficers = {
  CEO: 1,
  CFO: 1,
  President: 1,
  Secretary: 1
};

export default function AfterBillingDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AfterBillingDetailsFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Company Address Validation
    if (formData.companyAddressPreference.type === 'custom' && !formData.companyAddressPreference.customAddress) {
      newErrors.customAddress = 'Custom address is required';
      isValid = false;
    }

    // Business Activity Validation
    if (!formData.businessActivity) {
      newErrors.businessActivity = 'Business activity is required';
      isValid = false;
    }

    // Officers Validation
    const officerCounts = formData.officers.reduce((acc, officer) => {
      acc[officer.title] = (acc[officer.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(requiredOfficers).forEach(([title, required]) => {
      if (!officerCounts[title] || officerCounts[title] < required) {
        newErrors.officers = `At least ${required} ${title} is required`;
        isValid = false;
      }
    });

    // Shareholders Validation
    if (formData.shareholders.length === 0) {
      newErrors.shareholders = 'At least one shareholder is required';
      isValid = false;
    }

    // Option Pool Validation
    if (formData.optionPool.hasPool && !formData.optionPool.poolSize) {
      newErrors.optionPool = 'Option pool size is required';
      isValid = false;
    }

    // Vesting Schedule Validation
    if (!formData.vestingSchedule) {
      newErrors.vestingSchedule = 'Vesting schedule is required';
      isValid = false;
    }

    // Technology Developers Validation
    if (formData.technologyDevelopers.length === 0) {
      newErrors.technologyDevelopers = 'At least one technology developer is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      // Save data to backend
      toast.success('Company details saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving company details:', error);
      toast.error('Failed to save company details');
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = () => {
    const newOfficer: Officer = {
      id: crypto.randomUUID(),
      name: '',
      title: 'CEO',
      email: '',
      phone: '',
      hasSignatureAuthority: true
    };
    setFormData(prev => ({
      ...prev,
      officers: [...prev.officers, newOfficer]
    }));
  };

  const addShareholder = () => {
    const newShareholder: Shareholder = {
      id: crypto.randomUUID(),
      name: '',
      type: 'Founder',
      stockAmount: 0,
      percentage: 0
    };
    setFormData(prev => ({
      ...prev,
      shareholders: [...prev.shareholders, newShareholder]
    }));
  };

  const addOptionee = () => {
    const newOptionee: Optionee = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      optionAmount: 0
    };
    setFormData(prev => ({
      ...prev,
      optionees: [...prev.optionees, newOptionee]
    }));
  };

  const addTechnologyDeveloper = () => {
    const newDeveloper: TechnologyDeveloper = {
      id: crypto.randomUUID(),
      name: '',
      relationship: ''
    };
    setFormData(prev => ({
      ...prev,
      technologyDevelopers: [...prev.technologyDevelopers, newDeveloper]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Additional Company Details
          </h1>
          <p className="text-gray-600">
            Please provide the following information to complete your company setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Address Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Company Address</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.companyAddressPreference.type === 'provided'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      companyAddressPreference: { type: 'provided' }
                    }))}
                    className="text-[--primary]"
                  />
                  <span>Use address provided by Registate</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.companyAddressPreference.type === 'custom'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      companyAddressPreference: { type: 'custom' }
                    }))}
                    className="text-[--primary]"
                  />
                  <span>Use my own address</span>
                </label>
              </div>

              {formData.companyAddressPreference.type === 'custom' && (
                <div>
                  <input
                    type="text"
                    value={formData.companyAddressPreference.customAddress || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      companyAddressPreference: {
                        ...prev.companyAddressPreference,
                        customAddress: e.target.value
                      }
                    }))}
                    placeholder="Enter your US address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                  {errors.customAddress && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.customAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Business Activity Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Business Activity</h2>
            </div>

            <select
              value={formData.businessActivity}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                businessActivity: e.target.value
              }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                focus:ring-2 focus:ring-[--primary] focus:border-transparent"
            >
              <option value="">Select your field of business</option>
              {businessCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.businessActivity && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.businessActivity}
              </p>
            )}
          </div>

          {/* Officers Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="text-[--primary]" size={24} />
                <h2 className="text-xl font-semibold">Officers</h2>
              </div>
              <button
                type="button"
                onClick={addOfficer}
                className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors duration-200"
              >
                <Plus size={18} />
                Add Officer
              </button>
            </div>

            {errors.officers && (
              <p className="mb-4 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.officers}
              </p>
            )}

            <div className="space-y-6">
              {formData.officers.map((officer, index) => (
                <div key={officer.id} className="p-6 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        officers: prev.officers.filter(o => o.id !== officer.id)
                      }));
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={officer.name}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            officers: prev.officers.map(o =>
                              o.id === officer.id ? { ...o, name: e.target.value } : o
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <select
                        value={officer.title}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            officers: prev.officers.map(o =>
                              o.id === officer.id ? { ...o, title: e.target.value as Officer['title'] } : o
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      >
                        {Object.keys(requiredOfficers).map(title => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={officer.email}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            officers: prev.officers.map(o =>
                              o.id === officer.id ? { ...o, email: e.target.value } : o
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={officer.phone}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            officers: prev.officers.map(o =>
                              o.id === officer.id ? { ...o, phone: e.target.value } : o
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={officer.hasSignatureAuthority}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              officers: prev.officers.map(o =>
                                o.id === officer.id ? { ...o, hasSignatureAuthority: e.target.checked } : o
                              )
                            }));
                          }}
                          className="text-[--primary]"
                        />
                        <span>Has signature authority</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shareholders Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="text-[--primary]" size={24} />
                <h2 className="text-xl font-semibold">Shareholders</h2>
              </div>
              <button
                type="button"
                onClick={addShareholder}
                className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors duration-200"
              >
                <Plus size={18} />
                Add Shareholder
              </button>
            </div>

            {errors.shareholders && (
              <p className="mb-4 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.shareholders}
              </p>
            )}

            <div className="space-y-6">
              {formData.shareholders.map((shareholder) => (
                <div key={shareholder.id} className="p-6 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        shareholders: prev.shareholders.filter(s => s.id !== shareholder.id)
                      }));
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={shareholder.name}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            shareholders: prev.shareholders.map(s =>
                              s.id === shareholder.id ? { ...s, name: e.target.value } : s
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={shareholder.type}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            shareholders: prev.shareholders.map(s =>
                              s.id === shareholder.id ? { ...s, type: e.target.value as 'Founder' | 'Investor' } : s
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      >
                        <option value="Founder">Founder</option>
                        <option value="Investor">Investor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Amount
                      </label>
                      <input
                        type="number"
                        value={shareholder.stockAmount}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            shareholders: prev.shareholders.map(s =>
                              s.id === shareholder.id ? { ...s, stockAmount: parseInt(e.target.value) } : s
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage
                      </label>
                      <input
                        type="number"
                        value={shareholder.percentage}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            shareholders: prev.shareholders.map(s =>
                              s.id === shareholder.id ? { ...s, percentage: parseFloat(e.target.value) } : s
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Option Pool Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Percent className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Option Pool</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.optionPool.hasPool}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      optionPool: {
                        ...prev.optionPool,
                        hasPool: e.target.checked
                      }
                    }));
                  }}
                  className="text-[--primary]"
                />
                <span>Do you have plans for equity compensation/option pool?</span>
              </label>

              {formData.optionPool.hasPool && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pool Size (%)
                  </label>
                  <input
                    type="number"
                    value={formData.optionPool.poolSize || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        optionPool: {
                          ...prev.optionPool,
                          poolSize: parseFloat(e.target.value)
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                  {errors.optionPool && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.optionPool}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Optionees Section */}
          {formData.optionPool.hasPool && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-[--primary]" size={24} />
                  <h2 className="text-xl font-semibold">Option Recipients</h2>
                </div>
                <button
                  type="button"
                  onClick={addOptionee}
                  className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                    rounded-lg hover:bg-[--primary]/20 transition-colors duration-200"
                >
                  <Plus size={18} />
                  Add Recipient
                </button>
              </div>

              <div className="space-y-6">
                {formData.optionees.map((optionee) => (
                  <div key={optionee.id} className="p-6 bg-gray-50 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          optionees: prev.optionees.filter(o => o.id !== optionee.id)
                        }));
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={optionee.name}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              optionees: prev.optionees.map(o =>
                                o.id === optionee.id ? { ...o, name: e.target.value } : o
                              )
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                            focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={optionee.role}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              optionees: prev.optionees.map(o =>
                                o.id === optionee.id ? { ...o, role: e.target.value } : o
                              )
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                            focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option Amount
                        </label>
                        <input
                          type="number"
                          value={optionee.optionAmount}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              optionees: prev.optionees.map(o =>
                                o.id === optionee.id ? { ...o, optionAmount: parseInt(e.target.value) } : o
                              )
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                            focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vesting Schedule Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Vesting Schedule</h2>
            </div>

            <div>
              <input
                type="text"
                value={formData.vestingSchedule}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    vestingSchedule: e.target.value
                  }));
                }}
                placeholder="e.g., 48 month vesting with 12 month cliff"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent"
              />
              {errors.vestingSchedule && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.vestingSchedule}
                </p>
              )}
            </div>
          </div>

          {/* Compensation Method Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Compensation Method</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-6">
                 Continuing the AfterBillingDetails.tsx file content exactly where we left off:

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="payroll"
                    checked={formData.compensationMethod === 'payroll'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        compensationMethod: e.target.value as 'payroll' | 'consultant'
                      }));
                    }}
                    className="text-[--primary]"
                  />
                  <span>Payroll</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="consultant"
                    checked={formData.compensationMethod === 'consultant'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        compensationMethod: e.target.value as 'payroll' | 'consultant'
                      }));
                    }}
                    className="text-[--primary]"
                  />
                  <span>Consultant</span>
                </label>
              </div>

              {formData.compensationMethod === 'payroll' && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Note: Being on payroll requires valid work visa. Additional compliance matters apply.
                </p>
              )}
            </div>
          </div>

          {/* Technology Developers Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code className="text-[--primary]" size={24} />
                <h2 className="text-xl font-semibold">Technology Developers</h2>
              </div>
              <button
                type="button"
                onClick={addTechnologyDeveloper}
                className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors duration-200"
              >
                <Plus size={18} />
                Add Developer
              </button>
            </div>

            {errors.technologyDevelopers && (
              <p className="mb-4 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.technologyDevelopers}
              </p>
            )}

            <div className="space-y-6">
              {formData.technologyDevelopers.map((developer) => (
                <div key={developer.id} className="p-6 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        technologyDevelopers: prev.technologyDevelopers.filter(d => d.id !== developer.id)
                      }));
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={developer.name}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            technologyDevelopers: prev.technologyDevelopers.map(d =>
                              d.id === developer.id ? { ...d, name: e.target.value } : d
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship with Company
                      </label>
                      <input
                        type="text"
                        value={developer.relationship}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            technologyDevelopers: prev.technologyDevelopers.map(d =>
                              d.id === developer.id ? { ...d, relationship: e.target.value } : d
                            )
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Plans Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Hiring Plans</h2>
            </div>

            <textarea
              value={formData.hiringPlans || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  hiringPlans: e.target.value
                }));
              }}
              placeholder="Describe your hiring plans (optional)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                focus:ring-2 focus:ring-[--primary] focus:border-transparent min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg
                font-medium transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-[--primary] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-[--primary]">Need Assistance?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our support team is available 24/7 to help you complete your company setup.
                Contact us if you have any questions about the required information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}