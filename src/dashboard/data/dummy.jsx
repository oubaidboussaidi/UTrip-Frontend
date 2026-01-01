import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FaPlane, FaSuitcaseRolling, FaRegCalendarAlt } from 'react-icons/fa';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';
import { FaPlaneDeparture } from 'react-icons/fa';



export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        link: 'dashboard',
        name: 'overview',
        icon: <FiBarChart />,
      },
    ],
  },

  {
    title: 'Pages',
    links: [
      {
        link: 'dashboard/users',
        name: 'Users',
        icon: <IoMdContacts />,
      },/*
      {
        link: 'employees',
        name: 'Employees',
        icon: <FaSuitcaseRolling />,
      },*/
      {
        link: 'dashboard/events',
        name: 'Events',
        icon: <FaPlaneDeparture />,
      },
      {
        link: 'dashboard/reservations',
        name: 'Reservations',
        icon: <FaRegCalendarAlt />,
      },
      {
        link: 'dashboard/organizer-stats',
        name: 'Stats',
        icon: <AiOutlineAreaChart />,
      },
    ],
  },
  {
    title: 'Apps',
    links: [
      {
        link: 'dashboard/calendar',
        name: 'Events Calendar',
        icon: <AiOutlineCalendar />,
      },/*
      {
        link: 'kanban',
        name: 'Kanban',
        icon: <BsKanban />,
      },
      {
        link: 'editor',
        name: 'Editor',
        icon: <FiEdit />,
      },
      {
        link: 'color-picker',
        name: 'Color Picker',
        icon: <BiColorFill />,
      },
    ],
  },
  {
    title: 'Charts',
    links: [
      {
        link: 'line',
        name: 'Line',
        icon: <AiOutlineStock />,
      },
      {
        link: 'area',
        name: 'Area',
        icon: <AiOutlineAreaChart />,
      },
      {
        link: 'bar',
        name: 'Bar',
        icon: <AiOutlineBarChart />,
      },
      {
        link: 'pie',
        name: 'Pie',
        icon: <FiPieChart />,
      },
      {
        link: 'financial',
        name: 'Financial',
        icon: <RiStockLine />,
      },
      {
        link: 'color-mapping',
        name: 'Color Mapping',
        icon: <BsBarChart />,
      },
      {
        link: 'pyramid',
        name: 'Pyramid',
        icon: <GiLouvrePyramid />,
      },
      {
        link: 'stacked',
        name: 'Stacked',
        icon: <AiOutlineBarChart />,
      },*/
    ],
  },
];
