import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import { Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar } from '@mui/material';
import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { DRAWER_WIDTH } from './layout-constants';
import {
  exampleNavItems,
  getInitiallyOpenNavIds,
  isNavSelected,
  mainNavItems,
  type NavItem,
  toggleOpenNavIds,
} from './nav-items';

const navIcons: Record<string, ReactNode> = {
  employees: <PersonIcon />,
  reports: <BarChartIcon />,
  'reports-sales': <BarChartIcon />,
  'reports-traffic': <DescriptionIcon />,
  integrations: <LayersIcon />,
};

type DashboardSidebarProps = {
  open: boolean;
  variant: 'permanent' | 'temporary';
  onClose: () => void;
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const [openIds, setOpenIds] = useState(() => getInitiallyOpenNavIds(pathname, exampleNavItems));

  const renderItem = (item: NavItem, nested = false) => {
    const selected = isNavSelected(pathname, item);
    const hasChildren = Boolean(item.children?.length);
    const isOpen = openIds.includes(item.id);

    return (
      <div key={item.id}>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={selected}
          aria-expanded={hasChildren ? isOpen : undefined}
          onClick={() => {
            if (hasChildren) {
              setOpenIds((current) => toggleOpenNavIds(current, item.id));
            }
            onNavigate?.();
          }}
          sx={nested ? { pl: 4 } : undefined}
        >
          <ListItemIcon>{navIcons[item.id]}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
        {hasChildren ? (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List disablePadding>{item.children?.map((child) => renderItem(child, true))}</List>
          </Collapse>
        ) : null}
      </div>
    );
  };

  return (
    <List component="nav" aria-label="サイドバー">
      <ListSubheader disableSticky>Main items</ListSubheader>
      {mainNavItems.map((item) => renderItem(item))}
      <ListSubheader disableSticky>Example items</ListSubheader>
      {exampleNavItems.map((item) => renderItem(item))}
    </List>
  );
}

export default function DashboardSidebar({ open, variant, onClose }: DashboardSidebarProps) {
  const isTemporary = variant === 'temporary';

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={isTemporary ? { keepMounted: true } : undefined}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <NavLinks onNavigate={isTemporary ? onClose : undefined} />
    </Drawer>
  );
}
