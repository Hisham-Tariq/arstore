import { NavItem } from '../navigations/navigation.type';

export const adminNavItems: NavItem[] = [
  {
    title: 'Analytics',
    icon: 'reflection:dashboard',
    type: 'basic',
    link:'admin/dashboard',
  },
  {
    title: 'Manage Products',
    icon: 'reflection:product',
    type: 'collapsable',
    children: [
      {
        title: 'Add Products',
        icon: 'reflection:product',
        link: 'admin/add-products',
        type: 'basic',
      },
      {
        title: 'Products List',
        icon: 'reflection:productlist',
        link: 'admin/products-list',
        type: 'basic',
      },
      {
        title: 'Manage Stock',
        icon: 'reflection:stock',
        link: 'admin/manage-stock',
        type: 'basic',
      },
      {
        title: 'Stock List',
        icon: 'reflection:stocklist',
        link: 'admin/stock-list',
        type: 'basic',
      },
    ],
  },
  {
    title: 'Manage Main Category',
    icon: 'reflection:category',
    type: 'basic',
    link:'admin/manage-main-category',
  },
  {
    title: 'Manage Sub Category',
    icon: 'reflection:list',
    type: 'basic',
    link:'admin/manage-sub-category',
  },
  {
    title: 'Manage Orders',
    icon: 'reflection:manageorders',
    type: 'basic',
    link:'admin/manage-orders',
  },
  {
    title: 'Manage Events',
    icon: 'reflection:events',
    type: 'basic',
    link:'admin/manage-events',
  },
  {
    title: 'Manage Voucher Code',
    icon: 'reflection:events',
    type: 'basic',
    link: 'admin/voucher-code',
  },
  {
    title: 'Customers',
    icon: 'reflection:customers',
    type: 'basic',
    link:'admin/customers',
  },
  {
    title: 'Customers Queries',
    icon: 'reflection:customerquery',
    type: 'basic',
    link:'admin/queries',
  },
];
