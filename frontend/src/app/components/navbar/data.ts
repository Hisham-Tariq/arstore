import {NavItem} from "../navigations/navigation.type";

export const navItems: NavItem[] = [
  {
    title: "Home",
    link: "home",
    icon: "heroicons_outline:home",
    type: "basic",
  },
  {
    title: "Glasses",
    link: "products?category=glasses",
    icon: "reflection:products",
    type: "basic",
  },
  {
    title: "Lenses",
    link: "products?category=lenses",
    icon: "heroicons_solid:eye",
    type: "basic",
  },
  // {
  //   title: 'Products',
  //   icon: 'reflection:products',
  //   type: 'collapsable',
  //   children: [
  //     {
  //       title: 'Glasses',
  //       icon: 'reflection:products',
  //       link: 'products?category=glasses',
  //       type: 'basic',
  //     },
  //     {
  //       title: 'Lenses',
  //       link: 'products?category=lenses',
  //       type: 'basic',
  //     },
  //   ],
  // },
  {
    title: "About Us",
    link: "about-us",
    icon: "reflection:aboutus",
    type: "basic",
  },
  // {
  //   title: "Contact Us",
  //   link: "contact-us",
  //   icon: "reflection:contactus",
  //   type: "basic",
  // },
];
