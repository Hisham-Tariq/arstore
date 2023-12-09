export interface NavItem{
  title: string;
  icon?: string;
  svgIcon?: string;
  type: NavItemType;
  link?: string;
  children?: NavItem[];
}



export type NavItemType = 'basic' | 'collapsable'
