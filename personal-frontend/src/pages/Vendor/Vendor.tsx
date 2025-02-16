import React, { useState } from 'react';
import Navbar from '../userComponents/Navbar';
import CreateMenuForm from './CreateMenuForm';
import ViewOrdersTable from './ViewOrdersTable';
import CreditVendor from './CreditVendor';

const Vendor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Menu');

  const handleLabelClick = (label: string) => {
    setActiveTab(label);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Menu':
        return (<CreateMenuForm />);
      case 'Orders':
        return (<ViewOrdersTable />);
      case 'Credit Updates':
        return (<CreditVendor />);
      default:
        return null;
    }
  };

  const navbarItems = [
    { label: 'Menu', link: '#menu' },
    { label: 'Orders', link: '#orders' },
  ];

  return (
    <div className="flex">
      <div className="w-1/4">
      <Navbar items={navbarItems} onLabelClick={handleLabelClick} />
      </div>
      <div className="w-3/4 p-4">
      {renderContent()}
      </div>
    </div>
  );
};

export default Vendor;
