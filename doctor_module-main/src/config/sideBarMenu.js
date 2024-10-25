/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import { RiBarChartFill, RiHeartPulseLine, RiHotelBedFill, RiHealthBookLine } from 'react-icons/ri';
// import { BiEnvelope } from 'react-icons/bi';
// import { HiOutlineUserAdd } from 'react-icons/hi';
// import { CgUserList } from 'react-icons/cg';

export default [
    { title: 'Dashboard', href: '/doctor/dashboard', icon: <RiBarChartFill className="icon" /> },
    { title: 'Patients', href: '/doctor/patients', icon: <RiHealthBookLine className="icon" /> },
    { title: 'Facility', href: '/doctor/facility', icon: <RiHotelBedFill className="icon" /> },
    { title: 'Customer Engagement', href: '/doctor/customer-engagement', icon: <RiHeartPulseLine className="icon" /> },
];
