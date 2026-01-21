import React from 'react';
import SubscriberList from '../components/SubscriberList';
import PageHeader from '../components/common/PageHeader';

const SubscribersPage = () => {
  return (
    <div>
      <PageHeader title="Subscriber Management" />
      <SubscriberList />
    </div>
  );
};

export default SubscribersPage;
