import { useEffect, useState } from "react";
import { 
  Search, Plus, User2, Shield, MoreVertical, ChevronDown,
  Mail, Phone, X, Info, CheckCircle2, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import instance from "../../../../http/instance";
import LoadingComponent from "../../../../components/Loading";

interface SectionProps {
  companyId: string;
}

interface Member {
  id: string;
  companyId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone: string | null;
  profileImage: string | null;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'SUPERADMIN';
}

interface NewMemberData {
  role: string;
  member: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}

export default function CompanyMembersSection({ companyId }: SectionProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // For role change modal
  const [roleChangeModal, setRoleChangeModal] = useState({
    isOpen: false,
    memberId: '',
    currentRole: '' as Member['role'],
    memberName: ''
  });

  const [newMember, setNewMember] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'MEMBER'
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await instance.get(`/admin/company/${companyId}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchMembers();
    }
  }, [companyId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: NewMemberData = {
        role: newMember.role,
        member: {
          email: newMember.email,
          firstName: newMember.firstName,
          lastName: newMember.lastName,
          password: newMember.password
        }
      };

      await instance.post(`/admin/company/${companyId}/add-member`, data);
      toast.success('Member added successfully');
      
      const response = await instance.get(`/admin/company/${companyId}/members`);
      setMembers(response.data);
      
      setShowAddModal(false);
      setNewMember({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'MEMBER'
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  };
  
  const openRoleChangeModal = (member: Member) => {
    setRoleChangeModal({
      isOpen: true,
      memberId: member.id,
      currentRole: member.role,
      memberName: `${member.firstName} ${member.lastName}`
    });
  };
  
  const closeRoleChangeModal = () => {
    setRoleChangeModal({
      isOpen: false,
      memberId: '',
      currentRole: 'MEMBER',
      memberName: ''
    });
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await instance.put(`/admin/company/member/${memberId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      
      setMembers(prev => prev.map(member =>
        member.id === memberId ? { ...member, role: newRole as Member['role'] } : member
      ));
      
      closeRoleChangeModal();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      await instance.delete(`/admin/company/member/${memberId}`);
      toast.success('Member removed successfully');
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'name':
        return order * (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
      case 'email':
        return order * a.email.localeCompare(b.email);
      case 'role':
        return order * a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadgeColor = (role: Member['role']) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OWNER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ADMIN':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Company Members</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[--primary] text-white rounded-lg 
              hover:bg-[--primary]/90 transition-colors"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                    hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Role</span>
                  <ChevronDown size={16} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                    border border-gray-200 z-50">
                    <div>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="all">All Roles</option>
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="SUPERADMIN">Super Admin</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              >
                <option value="name">Sort by: Name</option>
                <option value="email">Sort by: Email</option>
                <option value="role">Sort by: Role</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingComponent />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <User2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Members Found</h3>
              <p className="text-gray-500 mt-2">
                {searchTerm || selectedRole !== 'all'
                  ? "Try adjusting your filters"
                  : "Add members to get started"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4">
                        <button
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Member
                        </button>
                      </th>
                      <th className="text-left p-4">
                        <button
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Contact
                        </button>
                      </th>
                      <th className="text-left p-4">
                        <button
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Role
                        </button>
                      </th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {member.profileImage ? (
                                <img
                                  src={member.profileImage}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User2 className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {member.userId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{member.email}</span>
                            </div>
                            {member.telephone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{member.telephone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => openRoleChangeModal(member)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm 
                              font-medium border ${getRoleBadgeColor(member.role)}`}
                          >
                            <Shield size={14} />
                            {member.role}
                            <ChevronDown size={14} />
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                                rounded-lg transition-colors"
                            >
                              <X size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                              rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <select
                    value={itemsPerPage}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-[--primary] text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Managing Members</h3>
              <p className="text-sm text-blue-700 mt-1">
                Add and manage company members here. You can update roles, remove members, and control 
                access levels. Make sure to assign appropriate roles based on responsibilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add New Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary]/90 
                    transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleChangeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Member Role</h3>
              <button
                onClick={closeRoleChangeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">
              Change role for <span className="font-medium text-gray-900">{roleChangeModal.memberName}</span>
            </p>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {['OWNER', 'ADMIN', 'MEMBER', 'SUPERADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(roleChangeModal.memberId, role)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border 
                    ${roleChangeModal.currentRole === role 
                      ? 'border-[--primary] bg-[--primary]/5' 
                      : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className={roleChangeModal.currentRole === role 
                      ? 'text-[--primary]' 
                      : 'text-gray-400'} />
                    <span className={roleChangeModal.currentRole === role 
                      ? 'font-medium text-[--primary]' 
                      : 'text-gray-700'}>
                      {role}
                    </span>
                  </div>
                  
                  {roleChangeModal.currentRole === role && (
                    <CheckCircle2 size={18} className="text-[--primary]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRoleChangeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}