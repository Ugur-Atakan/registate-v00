//@ts-nocheck

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import instance from '../../http/instance';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
export default function Services() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen"></div>
    </DashboardLayout>
  );
}
