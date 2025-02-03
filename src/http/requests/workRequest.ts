import instance from "../instance"

const fakeworkspacesdata=[
    {
      "id": "workspace-1-id",
      "name": "John's Business Workspace",
      "companies": [
        {
          "id": "company-1-id",
          "name": "John's Company LLC",
          "status": "ACTIVE"
        },
        {
          "id": "company-2-id",
          "name": "Another Business Inc.",
          "status": "IN_PROGRESS"
        }
      ]
    },
    {
      "id": "workspace-2-id",
      "name": "Side Project Workspace",
      "companies": [
        {
          "id": "company-3-id",
          "name": "Side Hustle Startup",
          "status": "PAYMENT_PENDING"
        }
      ]
    }
  ]


const fakeCompanyDetailsData = {
    "id": "company-1-id",
    "name": "John's Company LLC",
    "state": "Delaware",
    "status": "ACTIVE",
    "workspace": {
      "id": "workspace-1-id",
      "name": "John's Business Workspace"
    },
    "pricingPlan": {
      "id": "pricing-plan-1",
      "name": "Gold Plan",
      "price": 5000,
      "stripeId": "stripe_plan_123"
    },
    "companyDetails": {
      "totalShares": 1000,
      "parValuePerShare": 1,
      "businessActivity": "Technology Services",
      "compensationMethod": "PAYROLL"
    },
    "formationSteps": [
      {
        "id": "step-1",
        "title": "Name Reservation",
        "description": "Reserving the company name",
        "status": "completed",
        "updatedAt": "2025-02-04T12:00:00Z"
      },
      {
        "id": "step-2",
        "title": "Filing Documents",
        "description": "Submitting formation documents",
        "status": "in_progress",
        "updatedAt": "2025-02-04T12:30:00Z"
      }
    ],
    "subscriptions": [
      {
        "id": "sub-1",
        "product": "Virtual Mailbox",
        "frequency": "MONTHLY",
        "amount": 100,
        "currency": "usd",
        "stripeSubscriptionId": "sub_123456"
      }
    ]
  }
  



const getCompanyDetails = async (companyId:string) => {
    try {
      const response = await instance.get(`/company/${companyId}/details`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };



const getUserWorkspaces = async () => {
    try {
      const response = await instance.get("/formation/company-type/all");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  export {  
    getUserWorkspaces,
    getCompanyDetails,
  };
