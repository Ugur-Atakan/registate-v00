import { useEffect, useState } from "react";
import instance from "../../../../http/instance";
import { Plus, Package, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface SectionProps {
  companyId: string;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  product: {
    name: string;
    description: string;
  };
  productPrice: {
    name: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: string;
    } | null;
  };
}

export default function CompanySubscriptionsSection({ companyId }: SectionProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubscriptions = async () => {
    try {
      const response = await instance.get(`/admin/company/${companyId}/subscriptions`);
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchSubscriptions();
    }
  }, [companyId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="text-green-500" size={16} />;
      case 'canceled':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'canceled':
        return 'bg-red-50 text-red-700';
      case 'past_due':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: number, currency: string, recurring: { interval: string } | null) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);

    if (recurring) {
      return `${formattedAmount}/${recurring.interval}`;
    }
    return formattedAmount;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Subscriptions</h2>
        <button
          onClick={() => navigate('/admin/company/add-subscription', { state: { companyId } })}
          className="flex items-center gap-2 px-4 py-2 bg-[--primary] text-white rounded-lg 
            hover:bg-[--primary]/90 transition-colors"
        >
          <Plus size={20} />
          Add Subscription
        </button>
      </div>

      <div className="space-y-4">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[--primary]/30 
                hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[--primary]/10 rounded-lg">
                    <Package className="w-5 h-5 text-[--primary]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{subscription.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{subscription.product.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm 
                        font-medium ${getStatusColor(subscription.status)}`}>
                        {getStatusIcon(subscription.status)}
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>

                      {/* Date Range */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>
                          {formatDate(subscription.startDate)}
                          {subscription.endDate && (
                            <>
                              <span className="mx-2">→</span>
                              {formatDate(subscription.endDate)}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Billing Interval */}
                <div className="text-right">
                  <div className="text-lg font-bold text-[--primary]">
                    {formatPrice(
                      subscription.productPrice.unit_amount,
                      subscription.productPrice.currency,
                      subscription.productPrice.recurring
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {subscription.productPrice.recurring ? 'Recurring' : 'One-time payment'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions</h3>
            <p className="text-gray-500">This company doesn't have any active subscriptions.</p>
          </div>
        )}
      </div>
    </div>
  );
}