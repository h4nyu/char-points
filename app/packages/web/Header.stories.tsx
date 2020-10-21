import React from 'react';
import { Header } from './Header';

export default {
  title: 'Example/Header',
  component: Header,
};

const Template: Story = () => <Header />;
export const LoggedIn = Template;
