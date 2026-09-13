import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

type DashboardHeaderProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  showMenuButton?: boolean;
};

export default function DashboardHeader({
  menuOpen,
  onToggleMenu,
  showMenuButton = true,
}: DashboardHeaderProps) {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {showMenuButton ? (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
            sx={{ mr: 2 }}
          >
            {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        ) : null}
        <Typography variant="h6" component="p">
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
